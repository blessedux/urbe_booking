# Google Maps Integration Setup

This project now supports fetching real location images from Google Maps for the unguided tours page.

## Setup Instructions

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:

   - **Places API** - For location details and photos
   - **Maps JavaScript API** - For interactive maps
   - **Static Maps API** - For static map images as fallback

4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

### 2. Configure Environment Variables

Create a `.env.local` file in your project root and add:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### 3. Restrict Your API Key (Recommended)

For security, restrict your API key:

1. Go to the Google Cloud Console
2. Navigate to "APIs & Services" > "Credentials"
3. Click on your API key
4. Under "Application restrictions", select "HTTP referrers"
5. Add your domain (e.g., `localhost:3000/*` for development)
6. Under "API restrictions", select "Restrict key"
7. Select only the APIs you need (Places API, Maps JavaScript API, Static Maps API)

## How It Works

### Image Fetching Priority

1. **Google Places Photos** - High-quality photos from Google Places API
2. **Static Maps** - Fallback to static map images
3. **Local Images** - Original images as final fallback
4. **Placeholder** - Camera icon if all else fails

### Caching

- Images are cached in localStorage to reduce API calls
- Cache keys are based on location name and coordinates
- Users can refresh images using the refresh button

### Features

- **Automatic fallback**: If Google Maps fails, falls back to local images
- **Loading states**: Shows spinner while fetching images
- **Error handling**: Graceful degradation if API is unavailable
- **Refresh functionality**: Users can manually refresh images
- **Responsive design**: Works on all screen sizes

## Usage

The integration is automatic - once you set up the API key, the unguided tours page will automatically fetch Google Maps images for each location.

### Manual Refresh

Users can click the refresh button (↻) on any card to reload the Google Maps image.

### Disabling Google Maps

If you want to disable Google Maps integration, simply don't set the `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable. The app will fall back to using local images.

## API Limits

- Google Places API: 1000 requests per day (free tier)
- Static Maps API: 1000 requests per day (free tier)
- Images are cached to minimize API usage

## Troubleshooting

### Common Issues

1. **"API key not found" warning**: Make sure you've set the environment variable correctly
2. **No images loading**: Check if your API key has the correct permissions
3. **Rate limiting**: Check your Google Cloud Console for usage limits
4. **CORS errors**: Ensure your domain is whitelisted in API key restrictions

### Debug Mode

Check the browser console for detailed error messages and API response information.
