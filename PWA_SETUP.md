# PWA (Progressive Web App) Setup

## Overview

Urbe Village Booking is now configured as a Progressive Web App (PWA) that can be installed on mobile devices and desktop computers.

## Features

- ✅ **Installable** - Can be added to home screen
- ✅ **Offline Support** - Basic caching for core pages
- ✅ **App-like Experience** - Full-screen mode without browser UI
- ✅ **Custom Icons** - Proper app icons for all platforms
- ✅ **Splash Screen** - Custom loading screen
- ✅ **Install Prompt** - Automatic install suggestion

## Files Created/Modified

### 1. Web App Manifest (`/public/manifest.json`)

- App name and description
- Icon configurations for all sizes
- Theme colors and display settings
- App shortcuts for quick access

### 2. Icons (`/public/icons/`)

Generated from `UVlogo2.png`:

- Standard PWA icons (16x16 to 512x512)
- Apple touch icons (152x152, 167x167, 180x180)
- Microsoft tile icons (144x144)
- Favicon files
- Safari pinned tab SVG

### 3. Service Worker (`/public/sw.js`)

- Caches core pages and assets
- Provides offline functionality
- Handles cache updates

### 4. PWA Installer Component (`/components/pwa-installer.tsx`)

- Shows install prompt when available
- Handles installation flow
- Registers service worker

### 5. Layout Configuration (`/app/layout.tsx`)

- PWA meta tags
- Icon configurations
- Theme colors
- Viewport settings

## How to Test

### 1. Desktop Testing

1. Open Chrome DevTools (F12)
2. Go to **Application** tab
3. Check **Manifest** section
4. Check **Service Workers** section
5. Look for install prompt in address bar

### 2. Mobile Testing

1. Open the app on your phone
2. Look for "Add to Home Screen" option
3. Install the app
4. Test offline functionality

### 3. PWA Audit

1. Open Chrome DevTools
2. Go to **Lighthouse** tab
3. Run PWA audit
4. Check for any missing requirements

## Installation Instructions for Users

### iOS (Safari)

1. Open the website in Safari
2. Tap the **Share** button (square with arrow)
3. Tap **Add to Home Screen**
4. Customize name if desired
5. Tap **Add**

### Android (Chrome)

1. Open the website in Chrome
2. Tap the **Menu** button (three dots)
3. Tap **Add to Home screen**
4. Tap **Add**

### Desktop (Chrome/Edge)

1. Look for install icon in address bar
2. Click the install icon
3. Click **Install**

## Customization

### Changing App Icon

1. Replace `/public/images/UVlogo2.png` with your new logo
2. Run the icon generation script:
   ```bash
   node scripts/generate-icons.js
   ```

### Updating Colors

1. Modify `theme_color` in `manifest.json`
2. Update `themeColor` in `layout.tsx`
3. Update color values in `browserconfig.xml`

### Adding More Cached Resources

1. Edit `urlsToCache` array in `/public/sw.js`
2. Add new URLs to cache

## Troubleshooting

### Icons Not Showing

- Check that all icon files exist in `/public/icons/`
- Verify manifest.json paths are correct
- Clear browser cache

### Install Prompt Not Appearing

- Ensure HTTPS is enabled (required for PWA)
- Check that manifest.json is valid
- Verify service worker is registered

### Offline Not Working

- Check service worker registration in DevTools
- Verify cached URLs are accessible
- Clear and reinstall service worker

## Browser Support

- ✅ Chrome (Android & Desktop)
- ✅ Safari (iOS & macOS)
- ✅ Edge (Windows)
- ✅ Firefox (Desktop)
- ⚠️ Firefox (Android) - Limited support

## Performance Notes

- Icons are optimized for size and quality
- Service worker caches essential resources
- App loads quickly on subsequent visits
- Offline functionality provides basic access
