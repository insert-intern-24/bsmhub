-- Create project_link table (similar to profile_link)
CREATE TABLE IF NOT EXISTS project_link (
  link TEXT NOT NULL,
  alt TEXT,
  project_id INTEGER NOT NULL,
  CONSTRAINT project_link_pkey PRIMARY KEY (link, project_id),
  CONSTRAINT project_link_project_id_fkey
    FOREIGN KEY (project_id)
    REFERENCES projects(project_id)
    ON DELETE CASCADE
);

-- Create index for faster lookups by project_id
CREATE INDEX IF NOT EXISTS project_link_project_id_idx ON project_link(project_id);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE project_link ENABLE ROW LEVEL SECURITY;

-- Allow all authenticated users to read project links
CREATE POLICY "Anyone can view project links"
  ON project_link
  FOR SELECT
  USING (true);

-- Allow project owners to insert/update/delete their project links
-- projects.owner is profile_id, and profile.owner is auth.uid()
CREATE POLICY "Project owners can manage their project links"
  ON project_link
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      INNER JOIN profile ON projects.owner = profile.profile_id
      WHERE projects.project_id = project_link.project_id
      AND profile.owner = auth.uid()::text
    )
  );

-- Grant permissions
GRANT SELECT ON project_link TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON project_link TO authenticated;
