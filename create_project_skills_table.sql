-- Create project_skills table (similar to profile_skills)
CREATE TABLE IF NOT EXISTS project_skills (
  project_id INTEGER NOT NULL,
  skill_id INTEGER NOT NULL,
  CONSTRAINT project_skills_pkey PRIMARY KEY (project_id, skill_id),
  CONSTRAINT project_skills_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE,
  CONSTRAINT project_skills_skill_id_fkey
    FOREIGN KEY (skill_id)
    REFERENCES skills(skill_id)
    ON DELETE CASCADE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS project_skills_project_id_idx ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS project_skills_skill_id_idx ON project_skills(skill_id);

-- Add RLS (Row Level Security) policies
ALTER TABLE project_skills ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read project skills
CREATE POLICY "Anyone can view project skills"
  ON project_skills
  FOR SELECT
  USING (true);

-- Allow project owners to insert/update/delete their project skills
-- projects.owner is profile_id, and profile.owner is auth.uid()
CREATE POLICY "Project owners can manage their project skills"
  ON project_skills
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      INNER JOIN profile ON projects.owner = profile.profile_id
      WHERE projects.project_id = project_skills.project_id
      AND profile.owner = auth.uid()::text
    )
  );

-- Grant permissions
GRANT SELECT ON project_skills TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON project_skills TO authenticated;
