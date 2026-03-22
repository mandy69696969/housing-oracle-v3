'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { MetricCard } from '@/components/ui/MetricCard';

interface Props {
  data?: AnalysisV3;
}

export const MacroTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis } = useOracleStore();
  const analysis = injectedData || storeAnalysis;

  if (!analysis) return null;

  const w = analysis.worldBankData;
  const m = analysis.macroFactors;

  return (
    <div className="animate-fade-in space-y-10">
      {/* 1. Global Economic Anchors */}
      <section className="space-y-6">
        <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest">World Bank Economic Benchmarks</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard label="GDP/Capita" value={`$${Math.round(w.gdpPerCapita).toLocaleString()}`} sub="International Dollars" />
          <MetricCard label="GDP Growth" value={`${w.gdpGrowthPct}%`} trend={{ val: '0.2%', direction: 'up' }} />
          <MetricCard label="Inflation" value={`${w.inflationPct}%`} trend={{ val: 'Target', direction: 'neutral' }} accentColor="var(--amber)" />
          <MetricCard label="Unemployment" value={`${w.unemploymentPct}%`} />
          <MetricCard label="Urbanization" value={`${w.urbanPopPct}%`} sub="Total Population" />
        </div>
      </section>

      {/* 2. Micro-Macro Convergence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="fintech-card p-8 bg-surface2/30">
            <h3 className="font-display text-2xl text-text mb-6">Local Environmental Integrity</h3>
            <div className="space-y-6">
               {[
                  { l: 'Air Quality Index (AQI)', v: analysis.neighborhoodInsights.airQualityScore, t: 'Good' },
                  { l: 'Green Space Index', v: analysis.neighborhoodInsights.greenSpaceScore, t: 'Urban' },
                  { l: 'Flood Risk Grade', v: 100 - analysis.neighborhoodInsights.floodRiskScore, t: 'Zone 1' }
               ].map((m, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex justify-between items-end">
                        <span className="font-mono text-[10px] text-text2 uppercase">{m.l}</span>
                        <span className="font-mono text-[11px] text-blue font-bold">{m.v}% — {m.t}</span>
                     </div>
                     <div className="h-1.5 w-full bg-surface2 rounded-full overflow-hidden">
                        <div className="h-full bg-blue transition-all duration-1000" style={{ width: `${m.v}%` }} />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         <div className="fintech-card p-8">
            <h3 className="font-display text-2xl text-text mb-6">Socio-Economic Direction</h3>
            <div className="grid grid-cols-2 gap-8">
               <div className="p-4 bg-surface2 rounded-[4px]">
                  <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Pop. Growth</span>
                  <span className="text-xl font-display text-text">{m.populationGrowth}%</span>
               </div>
               <div className="p-4 bg-surface2 rounded-[4px]">
                  <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Interest Trend</span>
                  <span className="text-xl font-display text-blue uppercase">{m.interestRateTrend}</span>
               </div>
               <div className="p-4 bg-surface2 rounded-[4px]">
                  <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Unemployment</span>
                  <span className="text-xl font-display text-text">{m.unemploymentRate}%</span>
               </div>
               <div className="p-4 bg-surface2 rounded-[4px]">
                  <span className="font-mono text-[9px] text-text3 uppercase block mb-1">Market Sentiment</span>
                  <span className="text-xl font-display text-green uppercase">Bullish</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
