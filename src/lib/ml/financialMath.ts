export const calculateMortgage = (price: number, down: number, rate: number, term: number) => {
  return amortize(price - down, rate, term);
};

export const amortize = (principal: number, annualRatePct: number, years: number) => {
  const r = annualRatePct / 100 / 12;
  const n = years * 12;
  if (r === 0) return { monthlyPayment: principal / n, totalPayment: principal, totalInterest: 0 };
  const monthlyPayment = principal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  return { 
    monthlyPayment, 
    totalPayment: monthlyPayment * n, 
    totalInterest: monthlyPayment * n - principal 
  };
};

export const computeIRR = (initialInvestment: number, annualCashFlow: number, finalValue: number, years: number) => {
  let rate = 0.08;
  for (let i = 0; i < 100; i++) {
    let npv = -initialInvestment, dnpv = 0;
    for (let t = 1; t <= years; t++) {
      npv += annualCashFlow / Math.pow(1 + rate, t);
      dnpv -= t * annualCashFlow / Math.pow(1 + rate, t + 1);
    }
    npv += finalValue / Math.pow(1 + rate, years);
    dnpv -= years * finalValue / Math.pow(1 + rate, years + 1);
    rate -= npv / dnpv;
    if (Math.abs(npv) < 0.01) break;
  }
  return rate * 100;
};

export const calculateROI = (initialInvestment: number, finalValue: number, cashFlow: number) => {
  return ((finalValue + cashFlow - initialInvestment) / initialInvestment) * 100;
};
