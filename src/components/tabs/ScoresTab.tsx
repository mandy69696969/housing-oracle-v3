'use client';

import React from 'react';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface Props {
  data?: AnalysisV3;
}

export const ScoresTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis } = useOracleStore();
  const analysis = injectedData || storeAnalysis;

  if (!analysis) return null;

  const radarData = [
    { subject: 'Investment', A: analysis.scores.investment, fullMark: 100 },
    { subject: 'Livability', A: analysis.scores.livability, fullMark: 100 },
    { subject: 'Infrastructure', A: analysis.scores.infrastructure, fullMark: 100 },
    { subject: 'Liquidity', A: analysis.scores.marketLiquidity, fullMark: 100 },
    { subject: 'Affordability', A: analysis.scores.affordability, fullMark: 100 },
    { subject: 'Appreciation', A: analysis.scores.appreciation, fullMark: 100 },
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Vector Signature */}
        <div className="fintech-card p-8 h-[450px]">
           <div className="mb-8">
             <h3 className="font-display text-2xl text-text">Vector Signature</h3>
             <p className="font-mono text-[10px] text-text3 uppercase">Multi-dimensional Market Alignment</p>
           </div>
           <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text2)', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }} />
                <Radar
                   name="Market"
                   dataKey="A"
                   stroke="var(--blue)"
                   fill="var(--blue)"
                   fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
           </div>
        </div>

        {/* Granular Rings */}
        <div className="grid grid-cols-2 gap-8">
           <div className="fintech-card p-6 flex items-center justify-center">
             <ScoreRing score={analysis.neighborhoodInsights.walkScore} label="Walk Quality" size={80} />
           </div>
           <div className="fintech-card p-6 flex items-center justify-center">
             <ScoreRing score={analysis.neighborhoodInsights.transitScore} label="Transit Index" size={80} />
           </div>
           <div className="fintech-card p-6 flex items-center justify-center">
             <ScoreRing score={analysis.neighborhoodInsights.safetyScore} label="Safety Risk" size={80} />
           </div>
           <div className="fintech-card p-6 flex items-center justify-center">
             <ScoreRing score={analysis.neighborhoodInsights.schoolRating} label="Educational" size={80} />
           </div>
        </div>
      </div>

      {/* Institutional Signals */}
      <div className="fintech-card p-8">
         <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-8">Asset Quality Metrics</h4>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
               { l: 'Development Index', v: analysis.neighborhoodInsights.developmentIndex },
               { l: 'Green Space Score', v: analysis.neighborhoodInsights.greenSpaceScore },
               { l: 'Air Quality Index', v: analysis.neighborhoodInsights.airQualityScore },
               { l: 'Flood Risk Grade', v: 100 - analysis.neighborhoodInsights.floodRiskScore }
            ].map((m, i) => (
               <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="font-mono text-[9px] text-text2 uppercase">{m.l}</span>
                    <span className="font-display text-lg text-text">{m.v}</span>
                  </div>
                  <div className="h-1 w-full bg-surface2 rounded-full overflow-hidden">
                    <div className="h-full bg-blue" style={{ width: `${m.v}%` }} />
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};
