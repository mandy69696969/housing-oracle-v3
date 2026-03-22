'use client';

import React from 'react';
import { useOracleStore } from '@/store/useOracleStore';
import { OverviewTab } from '../tabs/OverviewTab';
import { ScoresTab } from '../tabs/ScoresTab';
import { MLForecastTab } from '../tabs/MLForecastTab';
import { FinancialTab } from '../tabs/FinancialTab';
import { MortgageTab } from '../tabs/MortgageTab';
import { MacroTab } from '../tabs/MacroTab';
import { ComparableTab } from '../tabs/ComparableTab';
import { RiskTab } from '../tabs/RiskTab';
import { TrendsTab } from '../tabs/TrendsTab';
import { MethodologyTab } from '../tabs/MethodologyTab';
import { clsx } from 'clsx';

export const AnalysisPanel = () => {
  const { 
    analysis, comparisonAnalysis, 
    activeTab, setActiveTab, 
    location, comparisonLocation,
    isComparing 
  } = useOracleStore();

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'trends', label: 'Price Trends' },
    { id: 'ml', label: 'ML Forecast' },
    { id: 'scores', label: 'Market Scores' },
    { id: 'financial', label: 'Financials' },
    { id: 'mortgage', label: 'Mortgage' },
    { id: 'macro', label: 'Macro' },
    { id: 'comparable', label: 'Comparables' },
    { id: 'risk', label: 'Risks' },
    { id: 'methodology', label: 'Methodology' },
  ];

  const renderTabContent = (data: any) => {
    if (!data) return null;
    switch(activeTab) {
      case 'overview': return <OverviewTab data={data} />;
      case 'trends': return <TrendsTab data={data} />;
      case 'ml': return <MLForecastTab data={data} />;
      case 'scores': return <ScoresTab data={data} />;
      case 'financial': return <FinancialTab data={data} />;
      case 'mortgage': return <MortgageTab data={data} />;
      case 'macro': return <MacroTab data={data} />;
      case 'comparable': return <ComparableTab data={data} />;
      case 'risk': return <RiskTab data={data} />;
      case 'methodology': return <MethodologyTab />;
      default: return <OverviewTab data={data} />;
    }
  };

  const renderContent = () => {
    if (!analysis) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-12">
           <div className="w-16 h-16 bg-surface2 rounded-full flex items-center justify-center mb-6 border border-border">
              <span className="text-2xl">⬡</span>
           </div>
           <h2 className="font-display text-2xl text-text mb-2">Awaiting Intelligence Selection</h2>
           <p className="font-sans text-sm text-text2 max-w-sm">
             Select a location and configure property parameters in the sidebar to execute an institutional analysis.
           </p>
        </div>
      );
    }

    if (isComparing && comparisonAnalysis) {
      return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
          <div className="flex flex-col gap-4 border-r border-border pr-8">
            <div className="bg-surface p-3 border border-border rounded-[4px] mb-2">
              <span className="font-mono text-[9px] text-blue uppercase tracking-widest font-bold">Vector A (Primary)</span>
              <h3 className="font-display text-lg text-text mt-1">{location?.display.split(',')[0]}</h3>
            </div>
            {renderTabContent(analysis)}
          </div>
          <div className="flex flex-col gap-4">
            <div className="bg-surface p-3 border border-border rounded-[4px] mb-2">
              <span className="font-mono text-[9px] text-amber uppercase tracking-widest font-bold">Vector B (Comparison)</span>
              <h3 className="font-display text-lg text-text mt-1">{comparisonLocation?.display.split(',')[0]}</h3>
            </div>
            {renderTabContent(comparisonAnalysis)}
          </div>
        </div>
      );
    }

    return renderTabContent(analysis);
  };

  return (
    <div id="analysis-viewport" className="flex-1 flex flex-col bg-bg overflow-hidden h-full">
      {/* 1. Dashboard Header */}
      {analysis && (
        <div className="p-4 lg:p-8 pb-0 animate-fade-in">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div className="space-y-1">
              <h1 className="font-display text-2xl lg:text-4xl text-text leading-tight tracking-tight">
                {location?.display.split(',')[0]}
              </h1>
              <p className="font-sans text-[11px] lg:text-sm text-text2 max-w-2xl leading-relaxed">
                {analysis.marketSummary}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
               <div className="flex items-center gap-2 px-3 py-1 bg-blue-bg border border-blue/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                  <span className="font-mono text-[9px] lg:text-[10px] text-blue font-bold uppercase tracking-widest">Analysis Active</span>
               </div>
               <span className="font-mono text-[8px] lg:text-[9px] text-text3">SYNTHESIZED {new Date().toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Tab Bar */}
          <nav className="flex items-center gap-1 border-b border-border overflow-x-auto no-scrollbar -mx-4 lg:mx-0 px-4 lg:px-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={clsx(
                  "px-4 lg:px-6 py-3.5 font-mono text-[9px] lg:text-[10px] uppercase font-medium transition-all relative shrink-0",
                  activeTab === tab.id 
                    ? "text-blue border-b-2 border-blue" 
                    : "text-text3 hover:text-text hover:bg-surface2"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* 2. Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 lg:p-8">
         {renderContent()}
      </div>
    </div>
  );
};
