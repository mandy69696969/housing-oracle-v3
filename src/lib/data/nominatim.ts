import { LocationData } from '@/store/useOracleStore';

export const geocodeAddress = async (query: string): Promise<LocationData[]> => {
  if (query.length < 3) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&accept-language=en`;
    const res = await fetch(url);
    const results = await res.json();
    return results.map((r: any) => ({
      display: r.display_name,
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.suburb,
      country: r.address?.country,
      countryCode: r.address?.country_code?.toUpperCase(),
    }));
  } catch (e) {
    console.error("Geocoding failed", e);
    return [];
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<LocationData | null> => {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1&accept-language=en`;
    const res = await fetch(url);
    const r = await res.json();
    if (!r || !r.display_name) return null;
    return {
      display: r.display_name,
      lat,
      lon,
      city: r.address?.city || r.address?.town || r.address?.village || r.address?.suburb,
      country: r.address?.country,
      countryCode: r.address?.country_code?.toUpperCase(),
    };
  } catch (e) {
    console.error("Reverse geocoding failed", e);
    return null;
  }
};
