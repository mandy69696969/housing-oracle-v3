export const fetchElevation = async (lat: number, lon: number) => {
  try {
    const response = await fetch(`https://api.opentopodata.org/v1/srtm30m?locations=${lat},${lon}`);
    if (!response.ok) throw new Error('Elevation Fetch Failed');
    
    const data = await response.json();
    return data.results[0]?.elevation || 0;
  } catch (err) {
    console.warn('Elevation Error:', err);
    return 0;
  }
};
