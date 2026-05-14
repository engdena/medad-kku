
CREATE TABLE public.student_portfolio_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('skill','achievement')),
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('innovation','certification','leadership','volunteering','technical','skill')),
  evidence_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_portfolio_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students manage own entries" ON public.student_portfolio_entries
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Mentors view all entries" ON public.student_portfolio_entries
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'mentor'::app_role));

CREATE POLICY "Companies view all entries" ON public.student_portfolio_entries
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'company'::app_role));

CREATE TRIGGER update_portfolio_entries_updated_at
  BEFORE UPDATE ON public.student_portfolio_entries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_portfolio_entries_user_id ON public.student_portfolio_entries(user_id);
