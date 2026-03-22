export const fetchClimateData = async (lat: number, lon: number) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
    const res = await fetch(url);
    const data = await res.json();
    
    if (!data.daily) return null;

    return {
      days: data.daily.time,
      tempMax: data.daily.temperature_2m_max,
      tempMin: data.daily.temperature_2m_min,
      precipitation: data.daily.precipitation_sum,
      riskIndex: (data.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0) / 7).toFixed(1)
    };
  } catch (e) {
    console.error("Open-Meteo fetch failed", e);
    return null;
  }
};
