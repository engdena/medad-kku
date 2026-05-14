
-- =========================
-- Roles
-- =========================
CREATE TYPE public.app_role AS ENUM ('student', 'mentor', 'company', 'admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- =========================
-- Profiles
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles readable by authenticated" ON public.profiles
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =========================
-- Student Data
-- =========================
CREATE TABLE public.medad_student_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  student_code TEXT,
  age INT,
  gender TEXT,
  high_school_gpa NUMERIC(3,2),
  sat_score INT,
  university_gpa NUMERIC(3,2),
  field_of_study TEXT DEFAULT 'Industrial Engineering',
  internships_completed INT DEFAULT 0,
  projects_completed INT DEFAULT 0,
  certifications INT DEFAULT 0,
  soft_skills_score NUMERIC(3,1) DEFAULT 0,
  self_learning_hours INT DEFAULT 0,
  technical_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  soft_skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  market_readiness_score INT DEFAULT 0,
  career_goals TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.medad_student_data ENABLE ROW LEVEL SECURITY;

-- Students: CRUD own
CREATE POLICY "Students manage own data" ON public.medad_student_data
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Mentors & companies & admins can SELECT all student rows (sensitive grades gated via view)
CREATE POLICY "Mentors view all students" ON public.medad_student_data
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'mentor'));
CREATE POLICY "Companies view all students" ON public.medad_student_data
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'company'));

-- =========================
-- Transcript access grants (student grants company)
-- =========================
CREATE TABLE public.transcript_access_grants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, company_id)
);
ALTER TABLE public.transcript_access_grants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students view own grants" ON public.transcript_access_grants
  FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students manage own grants" ON public.transcript_access_grants
  FOR ALL TO authenticated
  USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Companies view own grants" ON public.transcript_access_grants
  FOR SELECT TO authenticated USING (auth.uid() = company_id);

CREATE OR REPLACE FUNCTION public.has_transcript_access(_company_id UUID, _student_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.transcript_access_grants
                 WHERE company_id = _company_id AND student_id = _student_id);
$$;

-- =========================
-- Mentor messages
-- =========================
CREATE TABLE public.mentor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ
);
ALTER TABLE public.mentor_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants view messages" ON public.mentor_messages
  FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Send messages" ON public.mentor_messages
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- =========================
-- Timestamp trigger
-- =========================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_student_data_updated BEFORE UPDATE ON public.medad_student_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================
-- Auto-create profile + default role on signup
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

  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'student');
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
