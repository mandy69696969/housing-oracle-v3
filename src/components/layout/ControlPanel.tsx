'use client';

import React, { useState } from 'react';
import { useOracleStore } from '@/store/useOracleStore';
import { useAnalysis } from '@/hooks/useAnalysis';
import { geocodeAddress } from '@/lib/data/nominatim';
import { exportToPDF } from '@/lib/export/pdfService';
import { clsx } from 'clsx';

export const ControlPanel = () => {
  const { 
    location, setLocation, 
    propType, bedrooms, purpose, budget, holdingPeriod, setPropConfig,
    isAnalyzing, loadingStep, loadingProgress,
    isComparing, setIsComparing,
    analysis
  } = useOracleStore();

  const { runAnalysis } = useAnalysis();
  const [addressInput, setAddressInput] = useState(location?.display || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('location-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync address input when location changes externally (e.g. map click)
  React.useEffect(() => {
    if (location?.display) setAddressInput(location.display);
  }, [location]);

  const handleSearch = async (val: string) => {
    setAddressInput(val);
    if (val.length < 3) {
      setSuggestions([]);
      return;
    }
    const results = await geocodeAddress(val);
    setSuggestions(results);
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    
    // If no location selected but suggestions exist, auto-pick the first one
    if (!location && suggestions.length > 0) {
      const picked = suggestions[0];
      setLocation(picked);
      setAddressInput(picked.display || '');
      setSuggestions([]);
      // Pass directly — don't rely on state propagation
      runAnalysis(picked);
      return;
    }

    if (!location) return;
    runAnalysis();
  };

  const InputLabel = ({ children }: { children: React.ReactNode }) => (
    <label className="font-mono text-[9px] text-text3 uppercase tracking-widest mb-1.5 block font-medium">
      {children}
    </label>
  );

  return (
    <aside className="w-full lg:w-[300px] flex-shrink-0 h-fit lg:h-full overflow-y-auto bg-surface border-b lg:border-b-0 lg:border-r border-border z-[100] custom-scrollbar p-6">
      {/* 1. Location Intel */}
      <div className="mb-10">
        <h2 className="font-display text-base text-text mb-4">Location Entry</h2>
        <div className="relative group">
          <input
            id="location-search"
            type="text"
            value={addressInput}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
            placeholder="Search address or city..."
            className="w-full bg-surface2 border border-border rounded-[4px] px-3.5 py-2.5 font-mono text-[11px] text-text placeholder:text-text3 focus:border-blue focus:ring-1 focus:ring-blue/20 outline-none transition-all pr-12"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
             <span className="font-mono text-[8px] text-text3 border border-border px-1 rounded bg-surface">⌘K</span>
             <div className="w-4 h-4 text-text3 opacity-40">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
             </div>
          </div>

          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-[4px] shadow-xl z-[500] max-h-[180px] overflow-y-auto custom-scrollbar">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setLocation(s);
                    setAddressInput(s.display);
                    setSuggestions([]);
                  }}
                  className="w-full text-left p-3 hover:bg-surface2 font-mono text-[10px] border-b border-border last:border-0 transition-colors"
                >
                  <p className="text-text truncate">{s.display}</p>
                  <p className="text-text3 text-[8px] mt-0.5 uppercase">{s.country}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. Property Configuration */}
      <div className="space-y-6 mb-10">
        <h2 className="font-display text-base text-text mb-4 border-b border-border pb-2">Institutional Configuration</h2>
        
        <div>
          <InputLabel>Asset Class</InputLabel>
          <select 
            value={propType}
            onChange={(e) => setPropConfig({ propType: e.target.value as any })}
            className="w-full bg-surface2 border border-border rounded-[4px] py-2 px-2 font-mono text-[11px] text-text focus:outline-none focus:border-blue appearance-none cursor-pointer"
          >
            <option value="Apartment">Residential: Apartment</option>
            <option value="House">Residential: Detached House</option>
            <option value="Studio">Residential: Studio Unit</option>
            <option value="Penthouse">Residential: Penthouse</option>
            <option value="Commercial">Asset Type: Commercial</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <InputLabel>Units / BHK</InputLabel>
            <select 
               value={bedrooms}
               onChange={(e) => setPropConfig({ bedrooms: e.target.value })}
               className="w-full bg-surface2 border border-border rounded-[4px] py-2 px-2 font-mono text-[11px] text-text focus:outline-none focus:border-blue"
            >
              <option>Studio</option>
              <option>1 BHK</option>
              <option>2 BHK</option>
              <option>3 BHK</option>
              <option>4 BHK+</option>
            </select>
          </div>
          <div>
            <InputLabel>Motive</InputLabel>
            <select 
               value={purpose}
               onChange={(e) => setPropConfig({ purpose: e.target.value as any })}
               className="w-full bg-surface2 border border-border rounded-[4px] py-2 px-2 font-mono text-[11px] text-text focus:outline-none focus:border-blue"
            >
              <option value="Buy">Acquisition</option>
              <option value="Rent">Lease-up</option>
              <option value="Invest">L/T Holding</option>
              <option value="Flip">Market Flip</option>
            </select>
          </div>
        </div>

        <div>
           <InputLabel>Target Capital ($)</InputLabel>
           <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text3 font-mono text-[11px]">$</span>
              <input 
                type="text" 
                value={budget}
                onChange={(e) => setPropConfig({ budget: e.target.value })}
                placeholder="500,000"
                className="w-full bg-surface2 border border-border rounded-[4px] py-2 pl-7 pr-3 font-mono text-[11px] text-text focus:outline-none focus:border-blue"
              />
           </div>
        </div>

        <div>
          <InputLabel>Holding Period</InputLabel>
          <div className="flex gap-1">
            {['1yr', '3yr', '5yr', '10yr'].map((p) => (
              <button
                key={p}
                onClick={() => setPropConfig({ holdingPeriod: p as any })}
                className={clsx(
                  "flex-1 py-1.5 font-mono text-[9px] border rounded-[4px] transition-all tracking-wider",
                  holdingPeriod === p ? "bg-blue text-white border-blue" : "bg-surface2 border-border text-text2 hover:border-text3"
                )}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={clsx(
              "w-full py-2.5 rounded-[4px] border font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-2",
              isComparing 
                ? "bg-amber-bg border-amber text-amber" 
                : "bg-surface2 border-border text-text2 hover:border-text3"
            )}
          >
            {isComparing ? (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-amber animate-pulse" />
                <span>EXIT COMPARISON</span>
              </>
            ) : (
              <>
                <span>ENTER COMPARISON MODE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Analysis Action */}
      <div className="mt-auto">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!location && suggestions.length === 0)}
          className={clsx(
            "w-full py-3.5 rounded-[6px] font-sans font-medium text-sm tracking-tight transition-all relative overflow-hidden",
            (location || suggestions.length > 0) && !isAnalyzing 
              ? "bg-blue text-white hover:bg-blue/90 shadow-sm active:scale-[0.98]" 
              : "bg-surface2 text-text3 cursor-not-allowed border border-border"
          )}
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Synthesizing...</span>
            </div>
          ) : (
            <span>{isComparing ? 'Execute Secondary Analysis' : 'Execute Market Analysis'}</span>
          )}
        </button>

        {analysis && !isComparing && (
          <button
            onClick={() => exportToPDF('analysis-viewport', `Housing-Oracle-${location?.display.split(',')[0].replace(/\s+/g, '-')}.pdf`)}
            className="w-full mt-3 py-2.5 rounded-[6px] border border-blue/20 bg-blue-bg text-blue font-mono text-[10px] uppercase tracking-widest font-bold hover:bg-blue/5 transition-all flex items-center justify-center gap-2"
          >
            <span className="text-sm">⎙</span>
            <span>Export Institutional Report</span>
          </button>
        )}

        {isAnalyzing && (
          <div className="mt-6 space-y-2.5 animate-fade-in bg-surface2 p-3 rounded-[4px] border border-border">
             <div className="flex justify-between items-end mb-1">
               <span className="font-mono text-[8px] text-text3 uppercase tracking-widest">{loadingStep}</span>
               <span className="font-mono text-[9px] text-blue font-bold">{loadingProgress}%</span>
             </div>
             <div className="h-[2px] w-full bg-border rounded-full overflow-hidden">
               <div 
                 className="h-full bg-blue transition-all duration-300" 
                 style={{ width: `${loadingProgress}%` }}
               />
             </div>
          </div>
        )}
      </div>
    </aside>
  );
};
