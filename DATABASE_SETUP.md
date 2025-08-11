# Database-Driven Gallery Management System

This application now includes a database-driven gallery management system with admin capabilities powered by Supabase.

## Setup Instructions

### 1. Supabase Configuration

1. Create a new project at [Supabase](https://supabase.com)
2. Copy your project URL and anon key from the project settings
3. Create a `.env` file in the root directory with:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_SUPABASE_STORAGE_BUCKET=gallery-media
   ```

### 2. Database Schema Setup

Run the following SQL in your Supabase SQL editor to set up the required tables and policies:

```sql
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
```

### 3. Storage Bucket Setup

```sql
-- Create storage bucket for gallery media
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery-media', 'gallery-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to storage bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'gallery-media');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects FOR UPDATE USING (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects FOR DELETE USING (bucket_id = 'gallery-media' AND auth.role() = 'authenticated');
```

### 4. Optional: Seed Data

To migrate the existing hardcoded videos to the database, you can insert them manually:

```sql
INSERT INTO gallery_projects (title, description, room_type, style_type, video_url, featured) VALUES
('Modern Living Room', 'A complete makeover featuring sleek furniture and contemporary design elements.', 'Living Room', 'Modern', '/videos/modern-living-room-transformation.mp4', true),
('Scandinavian Bedroom', 'Cozy design with natural wood elements and minimalist Nordic aesthetics.', 'Bedroom', 'Scandinavian', '/videos/Cozy_Room_Transformation_Video_(1).mp4', true),
('Minimalist Kitchen', 'Clean, functional kitchen design with streamlined appliances and storage solutions.', 'Kitchen', 'Minimalist', '/videos/Kitchen_Pan_Video_Generation.mp4', true);
```

## Features

### Admin Interface (`/admin`)
- **Project Management**: Add, edit, and delete gallery projects
- **File Upload**: Upload videos and thumbnail images directly to Supabase Storage
- **Project Configuration**: Set room type, style type, descriptions, and featured status
- **Responsive Design**: Works on desktop and mobile devices

### Enhanced Gallery (`/gallery`)
- **Database-Driven**: Projects load from Supabase database
- **Advanced Filtering**: Filter by room type and style type
- **Fallback Support**: Uses hardcoded data when database is not configured
- **Project Counter**: Shows filtered vs total project counts
- **Featured Projects**: Supports featured project badges

### Technical Features
- **Environment-Based Configuration**: Graceful fallback when Supabase is not configured
- **Error Handling**: Comprehensive error handling and user feedback
- **Loading States**: Proper loading indicators throughout the application
- **Toast Notifications**: User feedback for admin actions
- **TypeScript Support**: Full type safety for database operations

## Usage

1. **Development Mode**: The application works without Supabase configuration, using fallback hardcoded data
2. **Production Mode**: Configure Supabase environment variables to enable full database functionality
3. **Admin Access**: Navigate to `/admin` to manage gallery projects (requires Supabase configuration)
4. **Public Gallery**: Visit `/gallery` to view projects with filtering capabilities

## File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client configuration and types
├── App.tsx                  # Main application with Admin and Gallery components
├── .env.example            # Environment variables template
└── DATABASE_SETUP.md       # This documentation file
```

The implementation maintains backward compatibility and preserves all existing functionality while adding powerful database-driven capabilities.