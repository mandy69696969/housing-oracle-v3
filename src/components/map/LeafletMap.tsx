'use client';

import dynamic from 'next/dynamic';
import React from 'react';

const MapInner = dynamic(() => import('./LeafletMapInner'), { 
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-bg">
      <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
    </div>
  )
});

export const LeafletMap = () => {
  return (
    <div className="absolute inset-0 z-50 overflow-hidden">
      <MapInner />
    </div>
  );
};
