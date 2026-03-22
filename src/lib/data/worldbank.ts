export const fetchWorldBankData = async (countryCode: string) => {
  if (!countryCode) return null;
  
  const indicators = [
    { id: 'NY.GDP.MKTP.KD.ZG', name: 'GDP Growth (%)' },
    { id: 'FP.CPI.TOTL.ZG', name: 'Inflation (%)' },
    { id: 'FR.INR.RINR', name: 'Real Interest Rate (%)' },
    { id: 'SP.POP.GROW', name: 'Population Growth (%)' }
  ];
  
  try {
    const promises = indicators.map(ind => 
      fetch(`https://api.worldbank.org/v2/country/${countryCode}/indicator/${ind.id}?format=json&per_page=5`)
        .then(res => res.json())
    );
    
    const results = await Promise.allSettled(promises);
    const data: any = {};
    
    results.forEach((res, i) => {
      if (res.status === 'fulfilled' && res.value[1]) {
        const ind = indicators[i];
        data[ind.id] = {
          name: ind.name,
          values: res.value[1].map((v: any) => ({
            year: v.date,
            value: v.value ? parseFloat(v.value.toFixed(2)) : null
          })).filter((v: any) => v.value !== null)
        };
      }
    });

    return data;
  } catch (e) {
    console.error("World Bank fetch failed", e);
    return null;
  }
};
