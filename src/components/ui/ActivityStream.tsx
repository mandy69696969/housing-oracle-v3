'use client';

import React, { useEffect, useState } from 'react';

const EVENTS = [
  "New Listing: 2BR Apartment in Berlin +4.2% YoY",
  "Forecast Update: Tokyo Central bullish correction",
  "Oracle Synthesis: San Francisco tech corridor stable",
  "Macro Alert: ECB Interest Rate pivot detected",
  "POI Update: 4 New transit hubs mapped in Mumbai",
  "Sentiment Shift: London rental demand +8% MoM",
  "Simulation: Monte Carlo GBM p95 threshold breach",
];

export const ActivityStream = () => {
  const [activeIndices, setActiveIndices] = useState<number[]>([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndices(prev => {
        const next = [...prev];
        next.shift();
        next.push(Math.floor(Math.random() * EVENTS.length));
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2 font-mono text-[9px] text-text3 h-12 overflow-hidden px-4 border-l border-border ml-8 hidden 2xl:flex">
      {activeIndices.map((idx, i) => (
        <div key={i} className="animate-slide-up whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-blue mr-2">●</span>
          {EVENTS[idx].toUpperCase()}
        </div>
      ))}
    </div>
  );
};
