-- User Projects Table for Supabase
-- This SQL should be executed in the Supabase SQL editor to create the table

CREATE TABLE user_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT, -- For future user authentication
    thumbnail TEXT,
    visualization_requests JSONB DEFAULT '[]'::JSONB
);

-- Add an index on user_id for future performance when user auth is implemented
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);

-- Add an index on created_at for sorting
CREATE INDEX idx_user_projects_created_at ON user_projects(created_at DESC);

-- Enable Row Level Security (RLS) for future user authentication
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- For now, allow all operations (will be restricted once user auth is implemented)
CREATE POLICY "Allow all operations on user_projects" ON user_projects
FOR ALL USING (true);