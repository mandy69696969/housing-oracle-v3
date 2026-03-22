'use client';

import React from 'react';
import { useOracleStore } from '@/store/useOracleStore';
import { clsx } from 'clsx';

export const LayerControl = () => {
  const { activeLayers, toggleLayer } = useOracleStore();

  const layers = [
    { id: 'heatmap', label: 'Heatmap' },
    { id: 'radius', label: '1.5km Radius' },
    { id: 'schools', label: 'Schools' },
    { id: 'hospitals', label: 'Hospitals' },
    { id: 'transit', label: 'Transit' },
    { id: 'parks', label: 'Parks' },
    { id: 'grocery', label: 'Grocery' },
  ];

  return (
    <div className="absolute top-4 right-4 z-[400] bg-surface/90 border border-accent/10 rounded-sm p-4 backdrop-blur-xl shadow-2xl min-w-[160px]">
      <h3 className="font-mono text-[9px] text-accent tracking-widest uppercase mb-4 opacity-70">MAP LAYERS</h3>
      <div className="space-y-3">
        {layers.map((l) => (
          <div key={l.id} className="flex items-center justify-between group cursor-pointer" onClick={() => toggleLayer(l.id)}>
            <span className="font-mono text-[10px] text-text-dim group-hover:text-text transition-colors">{l.label}</span>
            <div className={clsx(
              "w-7 h-4 rounded-full relative transition-all duration-300",
              activeLayers.has(l.id) ? "bg-accent-3/20 border border-accent-3" : "bg-accent/10 border border-accent/10"
            )}>
              <div className={clsx(
                "w-2.5 h-2.5 rounded-full absolute top-1/2 -translate-y-1/2 transition-all duration-300 shadow-sm",
                activeLayers.has(l.id) ? "right-1 bg-accent-3 shadow-[0_0_8px_rgba(0,230,118,0.5)]" : "left-1 bg-muted"
              )} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
