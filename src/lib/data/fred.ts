export const fetchFREDData = async (seriesId: string = 'MORTGAGE30US') => {
  try {
    // FRED often requires an API key for REST, but they provide CSVs. 
    // For this implementation, we simulate the fetch or use a public proxy if available.
    // In a real prod env, this would be a secure server-side call.
    const response = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${seriesId}`);
    if (!response.ok) throw new Error('FRED Fetch Failed');
    
    const csv = await response.text();
    const lines = csv.split('\n').filter(l => l.trim());
    const latest = lines[lines.length - 1].split(',')[1];
    
    return parseFloat(latest) || 6.5; // Fallback to institutional avg
  } catch (err) {
    console.warn('FRED Error:', err);
    return 6.5; 
  }
};
