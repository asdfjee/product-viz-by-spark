# Database Migration Required: Add media_type Column

## Overview
This update adds support for both images and videos in the gallery. To support this feature, the `gallery_projects` table needs a new `media_type` column.

## Required SQL Migration

Execute the following SQL statement in your Supabase SQL editor or database management tool:

```sql
ALTER TABLE gallery_projects 
ADD COLUMN media_type text NOT NULL DEFAULT 'video';
```

## Migration Details

- **Column Name**: `media_type`
- **Type**: `text`
- **Constraint**: `NOT NULL`
- **Default Value**: `'video'`
- **Valid Values**: `'video'` or `'image'`

## Backward Compatibility

- The default value of `'video'` ensures all existing records will continue to work as videos
- The application code includes fallback logic to treat any missing `media_type` as `'video'`
- No existing functionality will be broken by this migration

## Post-Migration Steps

1. Verify the column was added successfully:
   ```sql
   SELECT column_name, data_type, is_nullable, column_default 
   FROM information_schema.columns 
   WHERE table_name = 'gallery_projects' AND column_name = 'media_type';
   ```

2. Test that existing records have the correct default value:
   ```sql
   SELECT id, title, media_type FROM gallery_projects LIMIT 5;
   ```

## Storage Bucket Configuration

Ensure your Supabase storage bucket (default: `gallery-media`) is configured to accept both image and video file types:

- **Video formats**: `.mp4`, `.mov`, `.avi`, `.webm`
- **Image formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`

## Testing Checklist

After applying the migration:

- [ ] Existing videos still display correctly in the gallery
- [ ] Admin page shows existing items with media type "Video"
- [ ] New image uploads work and display as images
- [ ] New video uploads work and display as videos
- [ ] Gallery modal handles both images and videos correctly