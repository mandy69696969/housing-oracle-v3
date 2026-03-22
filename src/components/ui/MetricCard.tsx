'use client';

import React from 'react';
import { clsx } from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: { val: string; direction: 'up' | 'down' | 'neutral' };
  accentColor?: string;
}

export const MetricCard = ({ label, value, sub, trend, accentColor }: MetricCardProps) => {
  return (
    <div className="fintech-card p-5 animate-slide-up">
      <div className="flex justify-between items-start mb-2">
        <span className="font-mono text-[10px] text-text-3 uppercase tracking-wider">{label}</span>
        {trend && (
          <span className={clsx(
            "font-mono text-[10px] flex items-center gap-0.5",
            trend.direction === 'up' ? "text-green" : trend.direction === 'down' ? "text-red" : "text-text-3"
          )}>
            {trend.direction === 'up' && '↑'}
            {trend.direction === 'down' && '↓'}
            {trend.val}
          </span>
        )}
      </div>
      
      <div className="flex items-baseline gap-1.5 overflow-hidden">
        <h4 className="font-display text-2xl lg:text-3xl text-text truncate whitespace-nowrap" style={{ color: accentColor }}>
          {value}
        </h4>
      </div>
      
      {sub && (
        <p className="font-sans text-[10px] text-text-2 mt-2 leading-tight">{sub}</p>
      )}
    </div>
  );
};
