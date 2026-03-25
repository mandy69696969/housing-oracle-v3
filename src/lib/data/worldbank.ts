export const fetchWorldBankData = async (countryCode: string) => {
  if (!countryCode) return { gdpPerCapita: 45000, gdpGrowth: 1.5, inflation: 2.5, unemployment: 5, urbanPop: 75 };
  
  const indicators: Record<string, string> = {
    gdpPerCapita: 'NY.GDP.PCAP.CD',
    gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
    inflation: 'FP.CPI.TOTL.ZG',
    unemployment: 'SL.UEM.TOTL.ZS',
    urbanPop: 'SP.URB.TOTL.IN.ZS',
  };
  
  const result: Record<string, number | null> = {};

  try {
    const promises = Object.entries(indicators).map(async ([key, id]) => {
      try {
        const res = await fetch(`https://api.worldbank.org/v2/country/${countryCode}/indicator/${id}?format=json&per_page=5`);
        const data = await res.json();
        if (data[1]?.length) {
          // Find the most recent non-null value
          const latest = data[1].find((v: any) => v.value !== null);
          result[key] = latest ? parseFloat(latest.value.toFixed(2)) : null;
        } else {
          result[key] = null;
        }
      } catch {
        result[key] = null;
      }
    });

    await Promise.allSettled(promises);

    return {
      gdpPerCapita: result.gdpPerCapita ?? 45000,
      gdpGrowth: result.gdpGrowth ?? 1.5,
      inflation: result.inflation ?? 2.5,
      unemployment: result.unemployment ?? 5,
      urbanPop: result.urbanPop ?? 75,
    };
  } catch (e) {
    console.error("World Bank fetch failed", e);
    return { gdpPerCapita: 45000, gdpGrowth: 1.5, inflation: 2.5, unemployment: 5, urbanPop: 75 };
  }
};
