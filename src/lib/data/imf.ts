export const fetchIMFData = async (indicator: string = 'PCPI_PCH') => {
  try {
    // IMF JSON API
    const response = await fetch(`https://www.imf.org/external/datamapper/api/v1/${indicator}`);
    if (!response.ok) throw new Error('IMF Fetch Failed');
    
    const data = await response.json();
    // Simplified parsing for oracle consumption
    return data;
  } catch (err) {
    console.warn('IMF Error:', err);
    return null;
  }
};
