'use client';

import React, { useEffect, useState } from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  size?: number;
}

export const ScoreRing = ({ score, label, size = 64 }: ScoreRingProps) => {
  const [offset, setOffset] = useState(100);
  const radius = size * 0.4;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => {
      setOffset(((100 - score) / 100) * circumference);
    }, 500);
    return () => clearTimeout(timer);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center gap-3 group">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--blue)"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-xl text-text leading-none">{score}</span>
        </div>
      </div>
      <span className="font-mono text-[9px] text-text-3 uppercase tracking-tighter text-center">{label}</span>
    </div>
  );
};
