'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { VerdictBox } from '@/components/ui/VerdictBox';
import { MetricCard } from '@/components/ui/MetricCard';
import { CityVoxel } from '@/components/ui/CityVoxel';
import { LeafletMap } from '@/components/map/LeafletMap';

interface Props {
  data?: AnalysisV3;
}

export const OverviewTab = ({ data }: Props) => {
  const store = useOracleStore();
  const analysis = data || store.analysis;

  if (!analysis) return (
    <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg animate-pulse">
      <span className="font-mono text-xs text-text3 uppercase">Initializing Analytical Engine...</span>
    </div>
  );

  const price = analysis.currentPriceUSD || 500000;

  return (
    <div className="animate-fade-in space-y-10 max-w-7xl mx-auto">
      {/* Level 1: Hero & Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <div className="fintech-card p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2 py-0.5 bg-blue-bg text-blue text-[9px] font-mono font-bold rounded-sm border border-blue/10">CORE VALUATION</span>
              <span className="font-mono text-[9px] text-text3">DOM: {analysis.timeline?.daysOnMarket || 18} DAYS</span>
            </div>
            <h2 className="font-display text-5xl text-text mb-2">${price.toLocaleString()}</h2>
            <div className="flex items-center gap-4 font-mono text-xs text-text2">
              <div className="flex items-center gap-1.5">
                 <span className="text-green">↑</span>
                 <span>${analysis.pricePerSqft.toLocaleString()}/SQFT</span>
              </div>
              <div className="w-1 h-1 bg-border rounded-full" />
              <span>{analysis.marketTrend?.toUpperCase()} TREND</span>
            </div>
          </div>
          
          <div className="mt-12">
            <div className="flex justify-between items-end mb-2">
              <span className="font-mono text-[9px] text-text3 uppercase">Data Integrity Score</span>
              <span className="font-mono text-[10px] text-text font-bold">{analysis.dataQualityScore}%</span>
            </div>
            <div className="h-1 w-full bg-surface2 rounded-full overflow-hidden">
               <div className="h-full bg-blue transition-all duration-1000" style={{ width: `${analysis.dataQualityScore}%` }} />
            </div>
          </div>
        </div>

        <VerdictBox 
          verdict={analysis.verdict.toUpperCase() as any}
          headline={analysis.verdictHeadline}
          reasoning={analysis.verdictReasoning}
          confidence={analysis.confidenceScore}
          regulatory={analysis.regulatoryContext?.foreignOwnershipNotes}
        />
      </div>

      {/* Level 2: Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="YoY Growth" value={`${analysis.yoyGrowth}%`} trend={{ val: '2.1%', direction: 'up' }} />
        <MetricCard label="Rental Yield" value={`${analysis.rentalYield}%`} accentColor="var(--green)" />
        <MetricCard label="Est. Monthly Rent" value={`$${analysis.rentUSD.toLocaleString()}/mo`} sub="Comparable local listing avg" />
        <MetricCard label="5YR Outlook" value={`+${analysis.projectedGrowth5yr}%`} trend={{ val: 'Strong', direction: 'up' }} accentColor="var(--blue)" />
      </div>

      {/* Level 3: Spatial Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 fintech-card h-[400px] relative overflow-hidden">
          <div className="absolute top-4 left-4 z-[500] pointer-events-none">
             <div className="bg-surface/90 backdrop-blur-md p-3 border border-border rounded-[4px] shadow-lg">
               <div className="font-display text-lg text-text">Spatial Viewport</div>
               <div className="font-mono text-[9px] text-text3 uppercase mt-1">RADIUS: 1.5KM · POIs: {analysis.poiData?.schools + analysis.poiData?.transit || 0} ACTIVE</div>
             </div>
          </div>
          <LeafletMap />
        </div>
        <div className="h-[400px]">
           <CityVoxel />
        </div>
      </div>
    </div>
  );
};
