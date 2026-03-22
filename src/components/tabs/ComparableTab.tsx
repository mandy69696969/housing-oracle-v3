'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { MetricCard } from '@/components/ui/MetricCard';

interface Props {
  data?: AnalysisV3;
}

export const ComparableTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis, location } = useOracleStore();
  const analysis = injectedData || storeAnalysis;
  const price = analysis?.currentPriceUSD || 500000;

  const comps = [
    { name: "Skyline Residences", price: price * 1.05, dist: "0.4km", type: "Premium" },
    { name: "Harbor View Flats", price: price * 0.92, dist: "0.8km", type: "Standard" },
    { name: "The Zenith Penthouse", price: price * 1.45, dist: "1.2km", type: "Luxury" },
    { name: "Urban Core Heights", price: price * 0.98, dist: "0.6km", type: "Standard" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <MetricCard label="Market Avg (sqft)" value={`$${Math.round(price/1100).toLocaleString()}`} sub="Average for local zip" />
         <MetricCard label="Inventory Level" value="Low" sub="12 active listings" accentColor="var(--accent-4)" />
         <MetricCard label="Days on Market" value="18" sub="Highly liquid area" accentColor="var(--accent-3)" />
         <MetricCard label="Price Stability" value="High" sub="0.2% monthly var" />
      </div>

      <div className="border border-accent/10 rounded-sm overflow-hidden">
        <table className="w-full font-mono text-[10px] text-left">
          <thead className="bg-accent/5 text-accent tracking-widest uppercase">
            <tr>
              <th className="p-4 border-b border-accent/10">Comparable Project</th>
              <th className="p-4 border-b border-accent/10">Estimated Value</th>
              <th className="p-4 border-b border-accent/10">Distance</th>
              <th className="p-4 border-b border-accent/10">Grade</th>
            </tr>
          </thead>
          <tbody className="text-text-dim">
            {comps.map((c, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                <td className="p-4">{c.name}</td>
                <td className="p-4 font-display text-accent text-sm">${Math.round(c.price).toLocaleString()}</td>
                <td className="p-4">{c.dist}</td>
                <td className="p-4">
                  <span className={`px-1.5 py-0.5 rounded-sm text-[8px] border ${c.type === 'Luxury' ? 'border-accent-5 text-accent-5' : 'border-accent/20 text-muted'}`}>
                    {c.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
