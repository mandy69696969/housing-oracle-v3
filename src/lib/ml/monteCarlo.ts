function gaussianRandom() {
  let u=0,v=0;
  while(!u)u=Math.random(); while(!v)v=Math.random();
  return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
}

export const runMonteCarlo = (currentPrice: number, annualGrowthPct: number, volatilityPct: number, years = 5, simulations = 2000) => {
  const mu = annualGrowthPct / 100;
  const sigma = volatilityPct / 100;
  const dt = 1 / 12;
  const steps = years * 12;
  
  const finals: number[] = [];
  
  for (let i = 0; i < simulations; i++) {
    let p = currentPrice;
    for (let t = 0; t < steps; t++) {
      p *= Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * gaussianRandom());
    }
    finals.push(p);
  }
  
  finals.sort((a, b) => a - b);
  const pct = (q: number) => finals[Math.floor(simulations * q)];
  
  return {
    p5: pct(0.05),
    p25: pct(0.25),
    p50: pct(0.50),
    p75: pct(0.75),
    p95: pct(0.95),
    mean: finals.reduce((a, b) => a + b, 0) / simulations,
    lossProbPct: finals.filter(v => v < currentPrice).length / simulations * 100,
    raw: finals
  };
};
