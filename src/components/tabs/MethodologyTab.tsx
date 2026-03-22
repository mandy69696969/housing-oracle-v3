'use client';

import React from 'react';
import { clsx } from 'clsx';

export const MethodologyTab = () => {
  return (
    <div className="animate-fade-in space-y-12 max-w-4xl">
      {/* 1. Executive Summary */}
      <section className="space-y-4">
        <h3 className="font-display text-3xl text-text">Mathematical Foundation</h3>
        <p className="font-sans text-sm text-text2 leading-relaxed">
          Housing Oracle v3.0 utilizes a multi-stage analytical pipeline combining classical quantitative finance with modern deep learning. Performance metrics are calculated with institutional-grade precision, accounting for drift, volatility, and regulatory constraints.
        </p>
      </section>

      {/* 2. Analytical Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* IRR & Financials */}
        <div className="fintech-card p-8 space-y-4">
          <div className="w-10 h-10 bg-blue-bg rounded-full flex items-center justify-center border border-blue/20">
            <span className="text-blue text-sm font-mono">ƒ(x)</span>
          </div>
          <h4 className="font-display text-xl text-text">Quantitative Finance (IRR)</h4>
          <p className="font-sans text-[12px] text-text2 leading-relaxed">
            The **Internal Rate of Return (IRR)** is calculated using a recursive **Newton-Raphson optimization** algorithm. This ensures that the discount rate makes the Net Present Value (NPV) of all cash flows (initial acquisition, annual rental income, and terminal sale value) equal to zero.
          </p>
          <div className="p-3 bg-surface2 rounded font-mono text-[9px] text-text3">
            NPV = Σ [ CFₜ / (1 + IRR)ᵗ ] = 0
          </div>
        </div>

        {/* GBM & Monte Carlo */}
        <div className="fintech-card p-8 space-y-4">
          <div className="w-10 h-10 bg-amber-bg rounded-full flex items-center justify-center border border-amber/20">
            <span className="text-amber text-sm font-mono">σ²</span>
          </div>
          <h4 className="font-display text-xl text-text">Stochastic Forecasting (GBM)</h4>
          <p className="font-sans text-[12px] text-text2 leading-relaxed">
            Five-year price distributions are modeled via **Geometric Brownian Motion (GBM)**. This process incorporates a deterministic drift component (historical city growth) and a stochastic diffusion component (local market volatility), solved over 2000 parallel paths.
          </p>
          <div className="p-3 bg-surface2 rounded font-mono text-[9px] text-text3">
            dSₜ = μSₜdt + σSₜdWₜ
          </div>
        </div>

        {/* Neural Network */}
        <div className="fintech-card p-8 space-y-4">
          <div className="w-10 h-10 bg-green-bg rounded-full flex items-center justify-center border border-green/20">
            <span className="text-green text-sm font-mono">⬡</span>
          </div>
          <h4 className="font-display text-xl text-text">Neural Net Architecture</h4>
          <p className="font-sans text-[12px] text-text2 leading-relaxed">
            Our **TensorFlow.js** execution layer runs a 4-layer **Dense Neural Network**. This model is trained on an 8-institutional vector including interest rates, GDP growth, urbanization velocity, and POI density to predict relative market alpha.
          </p>
          <div className="p-3 bg-surface2 rounded font-mono text-[9px] text-text3">
            input {'->'} Dense(64, relu) {'->'} Dropout(0.2) {'->'} Dense(32, relu) {'->'} Output(1)
          </div>
        </div>

        {/* Data Sources */}
        <div className="fintech-card p-8 space-y-4 border-dashed">
          <div className="w-10 h-10 bg-surface2 rounded-full flex items-center justify-center border border-border">
             <span className="text-text2 text-xs">☁</span>
          </div>
          <h4 className="font-display text-xl text-text">Real-Time Synthesis</h4>
          <p className="font-sans text-[12px] text-text2 leading-relaxed">
            Intelligence is synthesized via **Groq Llama-3 (70B/8B) inference**. This layer correlates raw indicators from OpenStreetMap, World Bank, and OpenMeteo into human-readable strategic narratives with a target confidence of 85%+.
          </p>
        </div>
      </div>
    </div>
  );
};
