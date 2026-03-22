'use client';

import React from 'react';
import { clsx } from 'clsx';

interface VerdictBoxProps {
  verdict: 'BUY' | 'WAIT' | 'AVOID';
  headline: string;
  reasoning: string;
  confidence: number;
  regulatory?: string;
}

export const VerdictBox = ({ verdict, headline, reasoning, confidence, regulatory }: VerdictBoxProps) => {
  const config = {
    BUY: { 
      bg: "bg-green-bg", 
      border: "border-green", 
      text: "text-green", 
      icon: "↑",
      iconBg: "bg-green"
    },
    WAIT: { 
      bg: "bg-amber-bg", 
      border: "border-amber", 
      text: "text-amber", 
      icon: "→",
      iconBg: "bg-amber"
    },
    AVOID: { 
      bg: "bg-red-bg", 
      border: "border-red", 
      text: "text-red", 
      icon: "↓",
      iconBg: "bg-red"
    },
  };

  const s = config[verdict] || config.WAIT;

  return (
    <div className={clsx(
      "w-full border-l-4 p-6 fintech-card border-l-transparent transition-all duration-700",
      s.bg, s.border.replace('border-', 'border-l-')
    )}>
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={clsx(
            "w-10 h-10 rounded-[6px] flex items-center justify-center text-white text-xl font-bold",
            s.iconBg
          )}>
            {s.icon}
          </div>
          <div>
            <span className="font-mono text-[9px] text-text3 uppercase tracking-widest block mb-1">Institutional Consensus</span>
            <h3 className="font-display text-2xl text-text leading-tight">{headline}</h3>
          </div>
        </div>
        <div className="text-right">
           <span className="font-mono text-[9px] text-text3 uppercase block">Confidence</span>
           <span className="font-mono text-2xl text-blue font-medium">{confidence}%</span>
        </div>
      </div>

      <div className="h-px bg-border-2/10 w-full mb-6" />

      <p className="font-sans text-[13px] text-text2 leading-relaxed mb-6 font-light italic">
        "{reasoning}"
      </p>

      {regulatory && (
        <div className="flex gap-3 items-center pt-4 border-t border-border/50">
           <div className="w-1.5 h-1.5 rounded-full bg-amber shadow-sm" />
           <p className="font-mono text-[9px] text-text3 uppercase break-words">
             {regulatory}
           </p>
        </div>
      )}
    </div>
  );
};
