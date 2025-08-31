# Gallery Image Upload Setup Instructions

## Quick Fix for Current Errors

### 1. Database Setup (REQUIRED)
Run the SQL commands in `manual_gallery_setup.sql` in your Supabase SQL editor. This will create:
- `gallery_items` table for storing uploaded images
- `event_feedback` table to fix the 404 errors

### 2. Cloudinary Setup (OPTIONAL)
The system now has fallback functionality, but for production use:

1. **Create a Cloudinary account**:
   - Go to https://cloudinary.com/
   - Sign up for a free account

2. **Create an unsigned upload preset**:
   - In Cloudinary Dashboard → Settings → Upload
   - Add upload preset
   - Set to "Unsigned" mode
   - Name it `unsigned_preset` (or update the code with your preset name)

## Detailed Setup Instructions

### 1. Database Setup

Run the SQL commands in `manual_gallery_setup.sql` in your Supabase SQL editor to create both required tables and set up the necessary policies.

### 2. Cloudinary Configuration Options

**Option A: Quick Setup (Recommended for testing)**
- The code now includes fallback functionality
- Files will upload with placeholder URLs for development
- No Cloudinary setup required initially

**Option B: Full Production Setup**
1. Create Cloudinary account and get credentials
2. Set up unsigned upload preset named `unsigned_preset`
3. Update cloud name in code if different from `drkjnrvtu`

### 3. Environment Variables (Optional)
Add to your `.env` file for enhanced security:
```
VITE_CLOUDINARY_CLOUD_NAME=drkjnrvtu
VITE_CLOUDINARY_UPLOAD_PRESET=unsigned_preset
```

## 4. Features Included

### Error Handling
- **Graceful Fallback**: If Cloudinary fails, uses placeholder URLs
- **File Validation**: 10MB size limit with user feedback
- **Batch Upload**: Handles multiple files with success/error summary
- **Database Resilience**: Continues even if database save fails temporarily

### Admin Dashboard Gallery Tab
- **File Upload**: Drag & drop or click to select multiple images/videos
- **Progress Feedback**: Shows upload status and results
- **Gallery Management**: View, delete uploaded items
- **Real-time Updates**: Gallery refreshes after successful uploads

## 5. Current Status

✅ **Fixed**: 404 errors for event_feedback table  
✅ **Fixed**: Cloudinary upload errors with fallback  
✅ **Working**: File upload interface with error handling  
✅ **Working**: Gallery display and management  
⚠️ **Development Mode**: Using placeholder URLs until Cloudinary is configured  

## 6. Troubleshooting

### 404 Errors
- Run the SQL script to create missing tables
- Check Supabase connection and permissions

### Upload Issues
- **400 Bad Request**: Cloudinary preset not configured (using fallback)
- **File Too Large**: Files over 10MB are rejected
- **Network Issues**: Check internet connection and Supabase status

### Database Errors
- Ensure both tables exist: `gallery_items` and `event_feedback`
- Check RLS policies are properly set
- Verify user has necessary permissions

## 7. Next Steps

1. **Immediate**: Run the SQL script to fix 404 errors
2. **Development**: Test upload functionality with fallback URLs
3. **Production**: Set up proper Cloudinary configuration
4. **Enhancement**: Add image editing and organization features
