// Google Maps API service for fetching location images
// Note: You'll need to set up a Google Cloud Project and enable the Places API
// Get your API key from: https://console.cloud.google.com/apis/credentials

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export interface GoogleMapsImageOptions {
  width?: number;
  height?: number;
  maxWidth?: number;
  maxHeight?: number;
  photoreference?: string;
}

export interface PlaceDetails {
  place_id: string;
  name: string;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
    html_attributions: string[];
  }>;
  formatted_address?: string;
  rating?: number;
  user_ratings_total?: number;
}

/**
 * Fetch place details from Google Places API
 */
export async function getPlaceDetails(query: string, location?: { lat: number; lng: number }): Promise<PlaceDetails | null> {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return null;
  }

  try {
    const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
    searchUrl.searchParams.append('query', query);
    searchUrl.searchParams.append('key', GOOGLE_MAPS_API_KEY);
    
    if (location) {
      searchUrl.searchParams.append('location', `${location.lat},${location.lng}`);
      searchUrl.searchParams.append('radius', '5000'); // 5km radius
    }

    const response = await fetch(searchUrl.toString());
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      const place = data.results[0];
      
      // Get detailed place information
      const detailsUrl = new URL('https://maps.googleapis.com/maps/api/place/details/json');
      detailsUrl.searchParams.append('place_id', place.place_id);
      detailsUrl.searchParams.append('fields', 'place_id,name,photos,formatted_address,rating,user_ratings_total');
      detailsUrl.searchParams.append('key', GOOGLE_MAPS_API_KEY);

      const detailsResponse = await fetch(detailsUrl.toString());
      const detailsData = await detailsResponse.json();

      if (detailsData.status === 'OK') {
        return detailsData.result;
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

/**
 * Generate Google Maps image URL
 */
export function getGoogleMapsImageUrl(
  photoreference: string,
  options: GoogleMapsImageOptions = {}
): string {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return '';
  }

  const {
    width = 400,
    height = 300,
    maxWidth = 400,
    maxHeight = 300
  } = options;

  const url = new URL('https://maps.googleapis.com/maps/api/place/photo');
  url.searchParams.append('maxwidth', maxWidth.toString());
  url.searchParams.append('maxheight', maxHeight.toString());
  url.searchParams.append('photo_reference', photoreference);
  url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

  return url.toString();
}

/**
 * Get a static map image URL
 */
export function getStaticMapUrl(
  location: { lat: number; lng: number },
  options: {
    width?: number;
    height?: number;
    zoom?: number;
    maptype?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  } = {}
): string {
  if (!GOOGLE_MAPS_API_KEY) {
    console.warn('Google Maps API key not found. Please set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY');
    return '';
  }

  const {
    width = 400,
    height = 300,
    zoom = 15,
    maptype = 'roadmap'
  } = options;

  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
  url.searchParams.append('center', `${location.lat},${location.lng}`);
  url.searchParams.append('zoom', zoom.toString());
  url.searchParams.append('size', `${width}x${height}`);
  url.searchParams.append('maptype', maptype);
  url.searchParams.append('key', GOOGLE_MAPS_API_KEY);

  return url.toString();
}

/**
 * Fallback function to get a location image
 * Tries Google Places API first, falls back to static map
 */
export async function getLocationImage(
  query: string,
  coordinates: { lat: number; lng: number },
  fallbackToStaticMap: boolean = true
): Promise<string | null> {
  try {
    // Try to get place details and photos
    const placeDetails = await getPlaceDetails(query, coordinates);
    
    if (placeDetails?.photos && placeDetails.photos.length > 0) {
      // Use the first photo
      return getGoogleMapsImageUrl(placeDetails.photos[0].photo_reference, {
        maxWidth: 400,
        maxHeight: 300
      });
    }
    
    // Fallback to static map if no photos found
    if (fallbackToStaticMap) {
      return getStaticMapUrl(coordinates, {
        width: 400,
        height: 300,
        zoom: 15
      });
    }
    
    return null;
  } catch (error) {
    console.error('Error getting location image:', error);
    
    // Final fallback to static map
    if (fallbackToStaticMap) {
      return getStaticMapUrl(coordinates, {
        width: 400,
        height: 300,
        zoom: 15
      });
    }
    
    return null;
  }
} 