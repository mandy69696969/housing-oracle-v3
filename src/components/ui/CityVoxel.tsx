'use client';

import React from 'react';

export const CityVoxel = () => {
  return (
    <div className="w-full h-full bg-surface2/50 relative overflow-hidden rounded-[4px] border border-border flex items-center justify-center">
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--text3) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
      
      {/* Moving Voxels (CSS Animation) */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {[...Array(16)].map((_, i) => (
          <div 
            key={i}
            className="absolute border border-blue/40 bg-blue/5 animate-pulse"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 80}%`,
              top: `${Math.random() * 80}%`,
              animationDelay: `${i * 0.2}s`,
              transform: `rotate(${Math.random() * 360}deg) translateZ(${i * 10}px)`,
              opacity: 0.3
            }}
          />
        ))}
        
        {/* Central Intelligence Pulse */}
        <div className="absolute w-24 h-24 rounded-full bg-blue/10 border border-blue flex items-center justify-center animate-ping" />
        <div className="absolute font-mono text-[10px] text-blue font-bold tracking-widest uppercase">
          Mapping Spatial Vectors...
        </div>
      </div>

      {/* Institutional Metadata Overlay */}
      <div className="absolute bottom-4 left-4 font-mono text-[8px] text-text3 flex flex-col gap-1">
         <span>VOXEL_GRID_LAYER_01: ACTIVE</span>
         <span>REF_GEO_MAPPING: ${Math.random().toString(16).slice(2, 8).toUpperCase()}</span>
      </div>
    </div>
  );
};
