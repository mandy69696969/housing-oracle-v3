export const fetchFREDData = async (seriesId: string = 'MORTGAGE30US') => {
  try {
    // Use FRED's public CSV endpoint — this works server-side and 
    // in client-side contexts where CORS is permissive.
    // Fallback gracefully to institutional average if blocked.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(
      `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);
    
    if (!response.ok) throw new Error('FRED Fetch Failed');
    
    const csv = await response.text();
    const lines = csv.split('\n').filter(l => l.trim() && !l.startsWith('DATE'));
    if (lines.length === 0) throw new Error('FRED Empty Response');
    
    const latest = lines[lines.length - 1].split(',')[1]?.trim();
    const rate = parseFloat(latest);
    
    if (isNaN(rate)) throw new Error('FRED Parse Failed');
    return rate;
  } catch (err) {
    console.warn('FRED unavailable, using institutional fallback:', (err as Error).message);
    return 6.5; // 30yr fixed institutional average
  }
};
