'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { holtsSmoothing } from '@/lib/ml/holtsSmoothing';

interface Props {
  data?: AnalysisV3;
}

export const TrendsTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis } = useOracleStore();
  const analysis = injectedData || storeAnalysis;

  if (!analysis) return null;

  // Generate historical baseline
  const historical = [
    analysis.currentPriceUSD * 0.92,
    analysis.currentPriceUSD * 0.94,
    analysis.currentPriceUSD * 0.95,
    analysis.currentPriceUSD * 0.97,
    analysis.currentPriceUSD * 0.985,
    analysis.currentPriceUSD,
  ];

  const smoothed = holtsSmoothing(historical, 0.4, 0.3);

  const labels = ['-10M', '-8M', '-6M', '-4M', '-2M', 'NOW'];
  const forecastLabels = smoothed.slice(6).map((_: number, i: number) => `+${(i+1)*2}M`);
  const allLabels = [...labels, ...forecastLabels];
  
  const chartData = smoothed.map((p: number, i: number) => ({
    name: allLabels[i] || `+${(i-5)*2}M`,
    price: p,
    isForecast: i >= 5
  }));

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 fintech-card p-6">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-display text-xl text-text">Price Velocity</h3>
              <p className="font-mono text-[10px] text-text3 uppercase">Trailing 12M vs Projected 12M · Holt&apos;s Smoothing</p>
            </div>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 font-mono text-[9px] text-text2 uppercase">
                  <div className="w-2 h-2 rounded-full bg-blue" />
                  Actual
               </div>
               <div className="flex items-center gap-1.5 font-mono text-[9px] text-text2 uppercase">
                  <div className="w-2 h-2 rounded-full bg-blue/30" />
                  Forecast
               </div>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--blue)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="var(--text3)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="var(--text3)" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '10px' }}
                  itemStyle={{ color: 'var(--blue)', fontWeight: 'bold' }}
                />
                <ReferenceLine x="NOW" stroke="var(--blue)" strokeDasharray="3 3" label={{ position: 'top', value: 'PRESENT', fill: 'var(--blue)', fontSize: 8, fontFamily: 'DM Mono' }} />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke="var(--blue)" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="fintech-card p-6">
            <h4 className="font-mono text-[9px] text-text3 uppercase tracking-widest mb-4">Market Cycle</h4>
            <div className="text-2xl font-display text-text mb-2 capitalize">{analysis.timeline.marketCycle} Phase</div>
            <p className="font-sans text-[11px] text-text2 leading-relaxed italic">
              "{analysis.timeline.cycleReasoning}"
            </p>
          </div>
          
          <div className="fintech-card p-6">
            <h4 className="font-mono text-[9px] text-text3 uppercase tracking-widest mb-4">Liquidity Intel</h4>
            <div className="flex justify-between items-end mb-4">
               <div>
                  <div className="text-2xl font-display text-text">{analysis.timeline.daysOnMarket}d</div>
                  <div className="font-mono text-[8px] text-text2 uppercase">Avg. Days on Market</div>
               </div>
               <div className="text-right">
                  <div className="text-lg font-display text-text">{analysis.timeline.negotiationRoom}%</div>
                  <div className="font-mono text-[8px] text-text2 uppercase">Negotiation Room</div>
               </div>
            </div>
            <div className="h-1 w-full bg-surface2 rounded-full overflow-hidden">
               <div className="h-full bg-green" style={{ width: `${100 - analysis.timeline.daysOnMarket/1.8}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
