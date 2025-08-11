import { createClient } from '@supabase/supabase-js'

// Get environment variables with fallbacks for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client only if environment variables are configured
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Storage bucket name
export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'gallery-media'

// Database types for gallery projects
export interface GalleryProject {
  id: string
  title: string
  description: string
  room_type: string
  style_type: string
  video_url: string
  thumbnail_url?: string
  featured: boolean
  created_at: string
  updated_at: string
}

// Insert type (without id, timestamps)
export interface GalleryProjectInsert {
  title: string
  description: string
  room_type: string
  style_type: string
  video_url: string
  thumbnail_url?: string
  featured?: boolean
}

// Update type (partial fields)
export interface GalleryProjectUpdate {
  title?: string
  description?: string
  room_type?: string
  style_type?: string
  video_url?: string
  thumbnail_url?: string
  featured?: boolean
}

/*
Database Schema - Run this SQL in your Supabase SQL editor:

-- Create gallery_projects table
CREATE TABLE IF NOT EXISTS gallery_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  room_type TEXT NOT NULL,
  style_type TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gallery_projects_updated_at
  BEFORE UPDATE ON gallery_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_projects ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON gallery_projects
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete (for admin)
CREATE POLICY "Allow authenticated users full access" ON gallery_projects
  FOR ALL USING (auth.role() = 'authenticated');

-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to storage bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-media');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
*/