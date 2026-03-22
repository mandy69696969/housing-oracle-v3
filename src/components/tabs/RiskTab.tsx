'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { clsx } from 'clsx';

interface Props {
  data?: AnalysisV3;
}

export const RiskTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis } = useOracleStore();
  const analysis = injectedData || storeAnalysis;

  if (!analysis) return null;

  const riskLevels = [
    { label: 'Regulatory', val: 30, impact: 'High' },
    { label: 'Market Volatility', val: 45, impact: 'Medium' },
    { label: 'Liquidity', val: 20, impact: 'Medium' },
    { label: 'Environmental', val: 15, impact: 'Low' },
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Risk Matrix */}
        <div className="fintech-card p-8">
          <div className="mb-10">
            <h3 className="font-display text-2xl text-text">Risk Matrix</h3>
            <p className="font-mono text-[10px] text-text3 uppercase">Probability vs Impact Mapping</p>
          </div>
          
          <div className="aspect-square w-full relative border-l border-b border-border pl-8 pb-8">
             {/* Matrix Grid */}
             <div className="absolute inset-x-8 inset-y-0 grid grid-cols-2 grid-rows-2 border border-border/30">
                <div className="border-r border-b border-border/30 bg-red-bg/20" />
                <div className="border-b border-border/30 bg-amber-bg/20" />
                <div className="border-r border-border/30 bg-amber-bg/10" />
                <div className="bg-green-bg/10" />
             </div>
             
             {/* Labels */}
             <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] text-text3 uppercase tracking-widest">Probability</div>
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-text3 uppercase tracking-widest">Impact Severity</div>
             
             {/* Plots (Simulated) */}
             <div className="absolute top-[20%] right-[30%] w-3 h-3 bg-red rounded-full shadow-[0_0_10px_rgba(248,113,113,0.5)] group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-surface border border-border p-2 rounded text-[8px] whitespace-nowrap z-50">Regulatory Lockup</div>
             </div>
             <div className="absolute top-[40%] right-[60%] w-3 h-3 bg-amber rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)] group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-surface border border-border p-2 rounded text-[8px] whitespace-nowrap z-50">Market Volatility</div>
             </div>
             <div className="absolute top-[70%] left-[20%] w-3 h-3 bg-green rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-surface border border-border p-2 rounded text-[8px] whitespace-nowrap z-50">Environmental</div>
             </div>
          </div>
        </div>

        {/* Risk Breakdown */}
        <div className="space-y-6">
           <div className="fintech-card p-8">
              <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-8">Critical Risk Factors</h4>
              <div className="space-y-6">
                 {analysis.risks.map((r, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <span className="w-6 h-6 rounded-full bg-red-bg text-red border border-red/20 flex flex-shrink-0 items-center justify-center font-mono text-[10px] font-bold">{i+1}</span>
                       <p className="font-sans text-[12px] text-text2 pt-0.5 leading-snug">{r}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="fintech-card p-8 bg-surface2/30">
              <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-6">Mitigation Opportunities</h4>
              <div className="space-y-4">
                 {analysis.opportunities.map((o, i) => (
                    <div key={i} className="flex gap-3 items-center">
                       <div className="w-1.5 h-1.5 rounded-full bg-green" />
                       <span className="font-sans text-[12px] text-text2 leading-snug">{o}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
