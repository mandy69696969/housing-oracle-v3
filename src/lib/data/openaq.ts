export const fetchOpenAQData = async (city: string) => {
  try {
    const res = await fetch(`https://api.openaq.org/v2/measurements?city=${encodeURIComponent(city)}&limit=1&order_by=datetime`);
    if (!res.ok) throw new Error("OpenAQ Failed");
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return {
        parameter: data.results[0].parameter,
        value: data.results[0].value,
        unit: data.results[0].unit,
        lastUpdated: data.results[0].date.utc
      };
    }
    return null;
  } catch (e) {
    console.error("OpenAQ fetch failed", e);
    return null;
  }
};
