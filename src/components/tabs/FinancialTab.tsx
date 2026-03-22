'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useOracleStore, AnalysisV3 } from '@/store/useOracleStore';
import { MetricCard } from '@/components/ui/MetricCard';
import { clsx } from 'clsx';

interface Props {
  data?: AnalysisV3;
}

export const FinancialTab = ({ data: injectedData }: Props) => {
  const { analysis: storeAnalysis } = useOracleStore();
  const analysis = injectedData || storeAnalysis;

  if (!analysis) return null;

  const m = analysis.keyMetrics;

  return (
    <div className="animate-fade-in space-y-10">
      {/* 8-Metric Institutional Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <MetricCard label="Cap Rate" value={`${m.capRate}%`} trend={{ val: '0.4%', direction: 'up' }} sub="Net Operating Income" />
        <MetricCard label="Price/Rent" value={m.priceToRentRatio} sub="Market Multiplier" />
        <MetricCard label="Break Even" value={`${m.breakEvenYears}y`} sub="Principal Recapture" />
        <MetricCard label="Cash-on-Cash" value={`${m.cashOnCashReturn}%`} accentColor="var(--green)" />
        <MetricCard label="Vacancy Rate" value={`${m.vacancyRate}%`} trend={{ val: '0.2%', direction: 'down' }} sub="Local Market Average" />
        <MetricCard label="Absorption" value={`${m.absorptionRate}mo`} sub="Inventory Turnover" />
        <MetricCard label="Demand Index" value={m.demandIndex} accentColor="var(--blue)" />
        <MetricCard label="P/I Ratio" value={m.priceToIncomeRatio} sub="Affordability Vector" />
      </div>

      {/* Investment Scenarios */}
      <div className="space-y-6">
        <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest">Projection Scenarios (Holding Period)</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { tag: 'BEAR', data: analysis.investmentScenarios.bear, border: 'border-red/20', accent: 'text-red' },
            { tag: 'BASE', data: analysis.investmentScenarios.base, border: 'border-blue/20', accent: 'text-blue' },
            { tag: 'BULL', data: analysis.investmentScenarios.bull, border: 'border-green/20', accent: 'text-green' },
          ].map((s, i) => (
            <div key={i} className={clsx("fintech-card p-6 border-t-2", s.border.replace('border-', 'border-t-'))}>
               <div className="flex justify-between items-start mb-4">
                  <span className={clsx("font-mono text-[10px] font-bold uppercase", s.accent)}>{s.tag}</span>
                  <div className="text-right">
                     <span className="font-mono text-[10px] text-text3 block uppercase">Projected IRR</span>
                     <span className="font-display text-xl text-text">{s.data.irr}%</span>
                  </div>
               </div>
               <div className="mb-6">
                  <div className="text-sm font-display text-text">${s.data.priceIn5yr.toLocaleString()}</div>
                  <div className="font-mono text-[9px] text-text3 uppercase">5-Year Valuation</div>
               </div>
               <p className="font-sans text-[11px] text-text2 leading-relaxed h-[60px] overflow-hidden">
                  {s.data.narrative}
               </p>
            </div>
          ))}
        </div>
      </div>

      {/* Waterfall Contribution (SHAP) */}
      <div className="fintech-card p-8 bg-surface border-blue/10">
        <h4 className="font-mono text-[10px] text-text3 uppercase mt-2 mb-8 tracking-widest">Institutional Valuation Attribution (SHAP)</h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={[
                { name: 'Base Liquidity', value: 85, fill: 'var(--blue)' },
                { name: 'Transit Alpha', value: 12, fill: 'var(--green)' },
                { name: 'Amenity Density', value: 8, fill: 'var(--green)' },
                { name: 'Macro Upside', value: 5, fill: 'var(--green)' },
                { name: 'Safety Factor', value: -4, fill: 'var(--red)' },
                { name: 'Climate Risk', value: -3, fill: 'var(--red)' },
              ]}
              margin={{ left: 40, right: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{ fill: "var(--text3)", fontSize: 10, fontFamily: "'DM Mono'" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'var(--surface2)', opacity: 0.5 }}
                contentStyle={{ 
                  background: "var(--surface)", 
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  fontFamily: "'DM Mono'",
                  fontSize: 10
                }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 p-4 bg-blue-bg/20 rounded-[4px] border border-blue/10">
           <p className="font-sans text-[12px] text-text2 leading-relaxed">
             The **SHAP (SHapley Additive exPlanations)** model isolates the contribution of each high-frequency indicator to the projected price alpha. Base liquidity represents the current market floor, while auxiliary vectors determine the terminal valuation delta.
           </p>
        </div>
      </div>

      {/* Corporate Tax / Regulatory */}
      <div className="fintech-card p-8 bg-surface2/50">
         <h4 className="font-mono text-[10px] text-text3 uppercase tracking-widest mb-6">Tax & Regulatory Assessment</h4>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
               <div>
                  <span className="font-mono text-[8px] text-text3 uppercase block">Stamp Duty / Acquisition</span>
                  <span className="font-display text-lg text-text">{analysis.regulatoryContext.stampDuty}%</span>
               </div>
               <div>
                  <span className="font-mono text-[8px] text-text3 uppercase block">Annual Property Tax</span>
                  <span className="font-display text-lg text-text">{analysis.regulatoryContext.annualPropertyTaxPct}%</span>
               </div>
            </div>
            <div className="space-y-4">
               <div>
                  <span className="font-mono text-[8px] text-text3 uppercase block">Foreign Ownership</span>
                  <span className="font-display text-lg text-blue">{analysis.regulatoryContext.foreignOwnershipAllowed ? 'ALLOWED' : 'RESTRICTED'}</span>
               </div>
               <div>
                  <span className="font-mono text-[8px] text-text3 uppercase block">Capital Gains Tax</span>
                  <span className="font-display text-lg text-text">{analysis.regulatoryContext.capitalGainsTax}%</span>
               </div>
            </div>
            <div className="p-4 bg-surface rounded-[4px] border border-border">
               <span className="font-mono text-[9px] text-text3 uppercase block mb-2">Legal Guidance</span>
               <p className="font-sans text-[10px] text-text2 leading-relaxed">
                  {analysis.regulatoryContext.foreignOwnershipNotes}
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};
