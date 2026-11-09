-- Security fixes: role self-assignment, RLS tightening, mentor chat, evidence URLs.

-- =========================
-- 1a) Sign-up can choose student, mentor or company. 'admin' and invalid values become student.
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
    NEW.email,
    NEW.raw_user_meta_data->>'avatar_url'
  );

  _role := CASE
    WHEN NEW.raw_user_meta_data->>'role' IN ('student','mentor','company')
      THEN (NEW.raw_user_meta_data->>'role')::public.app_role
    ELSE 'student'
  END;
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  IF _role = 'student' THEN
    INSERT INTO public.medad_student_data (user_id, student_code, field_of_study, career_goals,
      technical_skills, soft_skills)
    VALUES (NEW.id, 'S' || substr(NEW.id::text,1,6), 'Industrial Engineering',
      'Strategy & Operations Consulting',
      ARRAY['Lean Six Sigma','Operations Research','Power BI','Python','Financial Modeling'],
      ARRAY['Strategic Thinking','Problem Solving','Stakeholder Management']);
  END IF;

  RETURN NEW;
END; $$;

-- =========================
-- 1b) Companies only see students who granted them access
-- =========================
DROP POLICY IF EXISTS "Companies view all students" ON public.medad_student_data;
CREATE POLICY "Companies view granted students" ON public.medad_student_data
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'company') AND public.has_transcript_access(auth.uid(), user_id));

DROP POLICY IF EXISTS "Companies view all entries" ON public.student_portfolio_entries;
CREATE POLICY "Companies view granted entries" ON public.student_portfolio_entries
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'company') AND public.has_transcript_access(auth.uid(), user_id));

-- =========================
-- 1c) Students can read, but not change, their own GPA and scores
-- =========================
DROP POLICY IF EXISTS "Students manage own data" ON public.medad_student_data;
CREATE POLICY "Students view own data" ON public.medad_student_data
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- =========================
-- 1d) Profiles are no longer readable by every authenticated user
-- =========================
DROP POLICY IF EXISTS "Profiles readable by authenticated" ON public.profiles;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Mentors view all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'mentor'));

CREATE POLICY "Companies view granted profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'company') AND public.has_transcript_access(auth.uid(), user_id));

CREATE POLICY "Mentor profiles are visible" ON public.profiles
  FOR SELECT TO authenticated
  USING (public.has_role(user_id, 'mentor'));

-- =========================
-- 1e) Every message must involve a mentor
-- =========================
DROP POLICY IF EXISTS "Send messages" ON public.mentor_messages;
CREATE POLICY "Send messages" ON public.mentor_messages
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND (public.has_role(recipient_id, 'mentor') OR public.has_role(sender_id, 'mentor'))
  );

-- =========================
-- 1f) Mentor chat: students can find mentors, and messages arrive in realtime
-- =========================
CREATE POLICY "Mentor roles are visible" ON public.user_roles
  FOR SELECT TO authenticated
  USING (role = 'mentor');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'mentor_messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.mentor_messages;
  END IF;
END $$;

-- =========================
-- 1g) Evidence links must be http(s). NOT VALID leaves existing rows alone.
-- Case-insensitive to match the frontend check.
-- =========================
ALTER TABLE public.student_portfolio_entries
  ADD CONSTRAINT student_portfolio_entries_evidence_url_http
  CHECK (evidence_url IS NULL OR evidence_url ~* '^https?://') NOT VALID;
