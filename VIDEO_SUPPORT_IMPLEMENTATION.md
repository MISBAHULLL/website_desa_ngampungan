# Video Support Implementation

## Overview
Implementasi support video untuk fitur **Berita (News)** dan **Galeri (Gallery)**.

## Changes Made

### 1. Database Migration
File: `database/migrations/2026_08_08_161722_add_video_support_to_news_and_gallery_tables.php`

**News Table:**
- Added `video_path` (nullable) - untuk menyimpan path video yang diupload
- Added `video_url` (nullable) - untuk menyimpan URL video eksternal (YouTube/Vimeo)

**Gallery Photos Table:**
- Added `media_type` (enum: 'photo', 'video') - untuk membedakan tipe media
- Added `video_path` (nullable) - untuk menyimpan path video yang diupload
- Added `video_url` (nullable) - untuk menyimpan URL video eksternal

### 2. Models Updated

**News Model** (`app/Models/News.php`)
- Added `video_path` and `video_url` to `$fillable`

**GalleryPhoto Model** (`app/Models/GalleryPhoto.php`)
- Added `media_type`, `video_path`, and `video_url` to `$fillable`

### 3. Form Requests

**StoreNewsRequest** (`app/Http/Requests/Admin/StoreNewsRequest.php`)
- Added validation for `video` file upload:
  - Formats: mp4, webm, avi, mov
  - Max size: 100MB (102400 KB)
- Added validation for `video_url` (YouTube/Vimeo URLs)

### 4. Controllers Updated

**Admin NewsController** (`app/Http/Controllers/Admin/NewsController.php`)
- Updated `store()` method to handle video upload
- Updated `update()` method to handle video changes
- Added `resolveVideoPath()` helper method

**Admin GalleryController** (`app/Http/Controllers/Admin/GalleryController.php`)
- Updated `store()` method with `media_type` field
- Added conditional validation based on media type
- Added video upload handling (file or URL)
- Updated `update()` method for video support

**Public NewsController** (`app/Http/Controllers/Public/NewsController.php`)
- Updated `index()` to include video data in response
- Updated `show()` to include video data for single article

**Public GalleryController** (`app/Http/Controllers/Public/GalleryController.php`)
- Updated to include `mediaType`, `video`, and `videoUrl` in response

### 5. File Storage Structure

Videos will be stored in:
- **News videos**: `storage/app/public/news/videos/`
- **Gallery videos**: `storage/app/public/gallery/videos/`

## Features

### Upload Options
1. **Upload Video File**: Support MP4, WebM, AVI, MOV (max 100MB)
2. **Video URL**: Embed YouTube/Vimeo/external video URLs

### Admin Panel
- Select media type for Gallery (Photo or Video)
- Upload video file OR paste video URL
- All existing features remain functional

### Public Display
- News articles can now display videos alongside images
- Gallery can show mixed content (photos and videos)
- Video data is available via `video`, `videoUrl` properties

## Frontend Integration Needed

To complete this implementation, update the React components:

### Admin Forms
1. `resources/js/pages/admin/news/create.tsx`
2. `resources/js/pages/admin/news/edit.tsx`
3. `resources/js/pages/admin/gallery/create.tsx`
4. `resources/js/pages/admin/gallery/edit.tsx`

Add:
- Video file upload input
- Video URL input field
- Preview for uploaded/embedded videos
- Media type selector (for Gallery)

### Public Pages
1. `resources/js/pages/news/index.tsx`
2. `resources/js/pages/news/show.tsx`
3. `resources/js/pages/gallery/index.tsx`

Add:
- Video player component (`<video>` tag for uploaded files)
- YouTube/Vimeo embed for external URLs
- Fallback to image if video not available

## Example Usage

### Creating News with Video
```php
// Upload video file
'video' => UploadedFile // mp4, webm, avi, mov (max 100MB)

// OR use video URL
'video_url' => 'https://www.youtube.com/watch?v=...'
```

### Creating Gallery Item
```php
'media_type' => 'video', // or 'photo'
'video' => UploadedFile, // if uploading file
'video_url' => 'https://youtube.com/...', // if using URL
```

## Compatibility

✅ Backward compatible with existing data
✅ Existing photos/news continue to work
✅ Migration adds nullable columns
✅ Default media_type is 'photo'

## Testing Checklist

- [ ] Upload MP4 video to News
- [ ] Add YouTube URL to News
- [ ] Upload video to Gallery (media_type: video)
- [ ] Add Vimeo URL to Gallery
- [ ] Create Gallery photo (media_type: photo) - should work as before
- [ ] Edit existing News/Gallery items
- [ ] Verify public display shows videos correctly
- [ ] Test max file size validation (100MB)
- [ ] Test invalid file format rejection

## Configuration

Max upload size is controlled by:
- PHP `upload_max_filesize` (should be >= 100MB)
- PHP `post_max_size` (should be >= 100MB)
- Web server configuration (nginx/apache)

Update `php.ini` if needed:
```ini
upload_max_filesize = 100M
post_max_size = 100M
```
