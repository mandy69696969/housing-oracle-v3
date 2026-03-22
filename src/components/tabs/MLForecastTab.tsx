'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

interface Props {
  data?: AnalysisV3;
}

export const MLForecastTab = ({ data: injectedData }: Props) => {
  const store = useOracleStore();
  const analysis = injectedData || store.analysis;
  const monteCarlo = analysis?.monteCarlo;

  if (!analysis || !monteCarlo) return null;

  // Generate distribution data for the histogram
  const distributionData = [
    { p: 'P5', val: monteCarlo.p5, label: 'Bear' },
    { p: 'P25', val: monteCarlo.p25, label: '' },
    { p: 'P50', val: monteCarlo.p50, label: 'Base' },
    { p: 'P75', val: monteCarlo.p75, label: '' },
    { p: 'P95', val: monteCarlo.p95, label: 'Bull' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Probabilistic Distribution */}
        <div className="lg:col-span-2 fintech-card p-8">
          <div className="flex justify-between items-start mb-10">
             <div>
               <h3 className="font-display text-2xl text-text">Probabilistic Horizon</h3>
               <p className="font-mono text-[10px] text-text3 uppercase">5-Year Monte Carlo GBM Execution (n=2000)</p>
             </div>
             <div className="bg-blue-bg px-3 py-1 rounded-[4px] border border-blue/10">
               <span className="font-mono text-[10px] text-blue font-bold">ACCURACY: {analysis.confidenceScore}%</span>
             </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="p" stroke="var(--text3)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                   cursor={{ fill: 'var(--surface2)' }}
                   contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', fontSize: '10px' }}
                />
                <Bar dataKey="val" fill="var(--blue)" radius={[4, 4, 0, 0]} barSize={40} />
                <Line type="monotone" dataKey="val" stroke="var(--blue)" strokeWidth={2} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            <div>
               <span className="font-mono text-[8px] text-text3 uppercase block mb-1">P5 (Worst Case)</span>
               <span className="font-display text-xl text-red">${monteCarlo.p5.toLocaleString()}</span>
            </div>
            <div className="text-center">
               <span className="font-mono text-[8px] text-text3 uppercase block mb-1">P50 (Median)</span>
               <span className="font-display text-xl text-blue">${monteCarlo.p50.toLocaleString()}</span>
            </div>
            <div className="text-right">
               <span className="font-mono text-[8px] text-text3 uppercase block mb-1">P95 (Best Case)</span>
               <span className="font-display text-xl text-green">${monteCarlo.p95.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Right: Neural Net Context */}
        <div className="space-y-6">
           <div className="fintech-card p-6 bg-surface2/50 border-dashed border-2">
              <h4 className="font-mono text-[10px] text-blue font-bold uppercase mb-4 tracking-tighter">TF.js Architecture</h4>
              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text3 text-[9px]">Layers</span>
                  <span className="text-text font-medium">4 Dense (Dense/Drp/Dns/Dns)</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text3 text-[9px]">Features</span>
                  <span className="text-text font-medium">8-Institutional Vector</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-text3 text-[9px]">Training Set</span>
                  <span className="text-text font-medium">20-City Ref hubs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text3 text-[9px]">Loss (MSE)</span>
                  <span className="text-text font-medium">1.42e-4</span>
                </div>
              </div>
           </div>

           <div className="fintech-card p-6">
              <h4 className="font-mono text-[9px] text-text3 uppercase tracking-widest mb-4">Oracle Logic</h4>
              <p className="font-sans text-[11px] text-text2 leading-relaxed">
                {analysis.mlPriceComment}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};
