-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create form_submissions table
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  project_name TEXT NOT NULL,
  idea_description TEXT NOT NULL,
  target_user TEXT DEFAULT '',
  platform TEXT DEFAULT '',
  timeline TEXT DEFAULT '',
  features TEXT DEFAULT '',
  tech_stack TEXT DEFAULT '',
  reference_links TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create prd_results table
CREATE TABLE IF NOT EXISTS prd_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES form_submissions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  prd_content TEXT NOT NULL,
  vibe_prompt TEXT NOT NULL,
  mermaid_diagram TEXT DEFAULT '',
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prd_results ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can create own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Form submissions policies
CREATE POLICY "Users can view own submissions"
  ON form_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON form_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own submissions"
  ON form_submissions FOR UPDATE
  USING (auth.uid() = user_id);

-- PRD results policies
CREATE POLICY "Users can view own PRD results"
  ON prd_results FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create PRD results"
  ON prd_results FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_form_submissions_user_id ON form_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_prd_results_user_id ON prd_results(user_id);
CREATE INDEX IF NOT EXISTS idx_prd_results_submission_id ON prd_results(submission_id);
