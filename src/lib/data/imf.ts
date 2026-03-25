export const fetchIMFData = async (indicator: string = 'PCPI_PCH') => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(
      `https://www.imf.org/external/datamapper/api/v1/${indicator}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    
    if (!response.ok) throw new Error('IMF Fetch Failed');
    
    const data = await response.json();
    
    // Extract meaningful global averages from the IMF dataset
    const values = data?.values?.[indicator];
    if (!values) return { globalInflation: 4.5, source: 'fallback' };
    
    // Get US data as a reference, or fall back to global average
    const usData = values['USA'];
    if (usData) {
      const years = Object.keys(usData).sort().reverse();
      const latestYear = years[0];
      return { 
        globalInflation: parseFloat(usData[latestYear]?.toFixed(2)) || 4.5,
        year: latestYear,
        source: 'IMF' 
      };
    }
    
    return { globalInflation: 4.5, source: 'fallback' };
  } catch (err) {
    console.warn('IMF unavailable:', (err as Error).message);
    return { globalInflation: 4.5, source: 'fallback' };
  }
};
