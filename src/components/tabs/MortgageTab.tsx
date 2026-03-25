'use client';

import React, { useState } from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { amortize } from '@/lib/ml/financialMath';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data?: AnalysisV3;
}

export const MortgageTab = ({ data: injectedData }: Props) => {
  const store = useOracleStore();
  const analysis = injectedData || store.analysis;
  const [rate, setRate] = useState(analysis?.mortgageData.typicalRatePct || 4.25);
  const [down, setDown] = useState(20);

  React.useEffect(() => {
    if (analysis?.mortgageData.typicalRatePct) {
      setRate(analysis.mortgageData.typicalRatePct);
    }
  }, [analysis]);

  if (!analysis) return null;

  const principal = analysis.currentPriceUSD * (1 - down / 100);
  const { monthlyPayment, totalInterest } = amortize(principal, rate, 30);

  const chartData = [
    { name: 'Principal', val: principal, fill: 'var(--blue)' },
    { name: 'Interest', val: totalInterest, fill: 'var(--blue-bg)' },
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Sliders */}
        <div className="space-y-8">
          <div className="fintech-card p-8">
            <h3 className="font-display text-2xl text-text mb-8">Loan Parameters</h3>
            
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between font-mono text-[10px] uppercase">
                  <span className="text-text3">Annual Percentage Rate (APR)</span>
                  <span className="text-blue font-bold">{rate}%</span>
                </div>
                <input 
                  type="range" min="1" max="15" step="0.1" 
                  value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-surface2 rounded-full appearance-none cursor-pointer accent-blue"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between font-mono text-[10px] uppercase">
                  <span className="text-text3">Down Payment Capital</span>
                  <span className="text-blue font-bold">{down}%</span>
                </div>
                <input 
                  type="range" min="0" max="80" step="5" 
                  value={down} onChange={(e) => setDown(parseFloat(e.target.value))}
                  className="w-full h-1 bg-surface2 rounded-full appearance-none cursor-pointer accent-blue"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div className="fintech-card p-6">
                <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Monthly P&I</span>
                <span className="font-display text-2xl text-text">${Math.round(monthlyPayment).toLocaleString()}</span>
             </div>
             <div className="fintech-card p-6">
                <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Total Loan Cost</span>
                <span className="font-display text-2xl text-text">${Math.round(principal + totalInterest).toLocaleString()}</span>
             </div>
             <div className="fintech-card p-6">
                <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Loan-to-Value</span>
                <span className={`font-display text-2xl ${(100 - down) <= 80 ? 'text-green' : 'text-red'}`}>{100 - down}%</span>
                <span className={`font-mono text-[8px] block mt-1 ${(100 - down) <= 80 ? 'text-green' : 'text-red'}`}>
                  {(100 - down) <= 80 ? '✓ CONFORMING' : '⚠ HIGH LTV'}
                </span>
             </div>
          </div>
        </div>

        {/* Breakdown Chart */}
        <div className="fintech-card p-8 h-full flex flex-col">
          <h4 className="font-mono text-[10px] text-text3 uppercase mb-10 tracking-widest">30-Year Debt Amortization</h4>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" stroke="var(--text3)" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '10px' }}
                />
                <Bar dataKey="val" radius={[0, 4, 4, 0]} barSize={40} fill="var(--blue)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
             <div className="flex justify-between text-[11px] font-mono">
                <span className="text-text3 uppercase">Initial Principal</span>
                <span className="text-text font-bold">${Math.round(principal).toLocaleString()}</span>
             </div>
             <div className="flex justify-between text-[11px] font-mono">
                <span className="text-text3 uppercase">Lifetime Interest</span>
                <span className="text-red font-bold">${Math.round(totalInterest).toLocaleString()}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
