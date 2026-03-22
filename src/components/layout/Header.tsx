'use client';

import React from 'react';
import { useOracleStore } from '@/store/useOracleStore';
import { MiniGlobe } from '@/components/globe/MiniGlobe';
import { ActivityStream } from '@/components/ui/ActivityStream';
import { clsx } from 'clsx';

export const Header = () => {
  const { location, sourceStatus } = useOracleStore();

  const StatusBadge = ({ name, status }: { name: string, status: string }) => (
    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface2 border border-border text-[9px] font-mono whitespace-nowrap">
      <div className={clsx(
        "w-1 h-1 rounded-full",
        status === 'success' ? "bg-green" : status === 'loading' ? "bg-blue animate-pulse" : "bg-red"
      )} />
      <span className="text-text2 uppercase tracking-tighter">{name}</span>
    </div>
  );

  return (
    <header className="fixed top-0 left-0 right-0 h-[60px] z-[1000] bg-surface border-b border-border flex items-center justify-between px-6 select-none shadow-sm">
      {/* Left: Logo & Context */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue flex items-center justify-center rounded-[4px] text-white font-serif text-lg italic">
            H
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-lg tracking-tight text-text leading-tight">Housing Oracle</h1>
            <div className="flex items-center gap-2">
               <span className="font-mono text-[8px] text-text3 uppercase tracking-widest">V3.0 Institutional</span>
               <div className="w-1 h-1 rounded-full bg-green animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="h-6 w-px bg-border sm:hidden xl:block" />
        
        <ActivityStream />
      </div>

      {/* Center: Live Market Feed (Simulated) */}
      <div className="hidden xl:flex items-center gap-6 overflow-hidden max-w-[400px]">
        <div className="flex gap-4 items-center">
          {[
            { l: 'US10Y', v: '4.22%', t: 'up' },
            { l: 'REIT_IDX', v: '1,244.2', t: 'down' },
            { l: 'S&P500', v: '5,241.0', t: 'up' }
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-1.5 font-mono text-[10px]">
              <span className="text-text3">{m.l}</span>
              <span className="text-text font-medium">{m.v}</span>
              <span className={m.t === 'up' ? 'text-green' : 'text-red'}>{m.t === 'up' ? '↑' : '↓'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Intelligence Status */}
      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2">
          {Object.entries(sourceStatus).map(([name, status]) => (
            <StatusBadge key={name} name={name} status={status} />
          ))}
        </div>

        <div className="h-8 w-px bg-border hidden lg:block" />

        <div className="flex items-center gap-3 pr-2">
          <div className="text-right hidden sm:block">
            <div className="font-mono text-[9px] text-text3 uppercase">Location Sync</div>
            <div className="font-mono text-[10px] text-text truncate max-w-[150px]">
              {location?.display || 'NO_LOCATION_SELECTED'}
            </div>
          </div>
          <button 
             onClick={() => {
                const sidebarSearch = document.querySelector('aside input') as HTMLInputElement;
                sidebarSearch?.focus();
             }}
             className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-text2 hover:bg-surface2 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};
