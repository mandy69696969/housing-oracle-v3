'use client';

import React from 'react';

export const GlobalEffects = () => {
  return (
    <>
      {/* Scan Line */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9999] h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(0,210,255,0.6) 20%, rgba(0,210,255,1) 50%, rgba(0,210,255,0.6) 80%, transparent 100%)",
          animation: "scan 6s linear infinite",
          opacity: 0.25,
        }}
      />

      {/* Noise Texture */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.022,
        }}
      />

      {/* Vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[9997]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(2,4,10,0.7) 100%)",
        }}
      />
    </>
  );
};
