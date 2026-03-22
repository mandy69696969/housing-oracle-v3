export const holtsSmoothing = (data: number[], alpha = 0.5, beta = 0.3) => {
  if (data.length < 2) return data;
  
  let level = data[0];
  let trend = data[1] - data[0];
  const results = [level + trend];
  
  for (let i = 1; i < data.length; i++) {
    const lastLevel = level;
    level = alpha * data[i] + (1 - alpha) * (level + trend);
    trend = beta * (level - lastLevel) + (1 - beta) * trend;
    results.push(level + trend);
  }
  
  // Forecast 12 steps
  for (let i = 0; i < 12; i++) {
    const lastLevel = level;
    level = level + trend;
    results.push(level);
  }
  
  return results;
};
