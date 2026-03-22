import { create } from 'zustand';

export type PropertyType = 'Apartment' | 'House' | 'Studio' | 'Penthouse' | 'Commercial' | 'Plot' | 'Co-living' | 'Serviced';
export type Purpose = 'Buy' | 'Rent' | 'Invest' | 'Flip';
export type HoldingPeriod = '1yr' | '3yr' | '5yr' | '10yr' | '15yr+';
export type DataSource = 'OSM' | 'WorldBank' | 'OpenMeteo' | 'TensorFlow' | 'GroqAI' | 'REST';
export type SourceStatus = 'idle' | 'loading' | 'success' | 'error';
export type TabName = 'overview' | 'trends' | 'ml' | 'scores' | 'financial' | 'mortgage' | 'macro' | 'comparable' | 'risk' | 'methodology';

export interface LocationData {
  display: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  countryCode?: string;
}

export interface AnalysisV3 {
  marketSummary: string;
  currentPriceUSD: number;
  pricePerSqft: number;
  pricePerSqm: number;
  rentUSD: number;
  yoyGrowth: number;
  projectedGrowth5yr: number;
  rentalYield: number;
  annualVolatility: number;
  marketTrend: 'bullish' | 'neutral' | 'bearish';
  verdict: 'buy' | 'wait' | 'avoid';
  confidenceScore: number;
  verdictHeadline: string;
  verdictReasoning: string;
  dataQualityScore: number;
  mlPriceComment: string;
  scores: {
    investment: number;
    livability: number;
    infrastructure: number;
    marketLiquidity: number;
    affordability: number;
    appreciation: number;
  };
  keyMetrics: {
    priceToRentRatio: number;
    capRate: number;
    breakEvenYears: number;
    cashOnCashReturn: number;
    vacancyRate: number;
    demandIndex: number;
    absorptionRate: number;
    priceToIncomeRatio: number;
    grossRentMultiplier: number;
  };
  neighborhoodInsights: {
    walkScore: number;
    transitScore: number;
    safetyScore: number;
    schoolRating: number;
    greenSpaceScore: number;
    airQualityScore: number;
    developmentIndex: number;
    floodRiskScore: number;
  };
  poiData: {
    schools: number;
    hospitals: number;
    transit: number;
    parks: number;
    grocery: number;
    fitness: number;
  };
  risks: string[];
  opportunities: string[];
  comparableAreas: Array<{
    name: string;
    priceUSD: number;
    trend: '↑' | '↓' | '→';
    yoy: number;
  }>;
  timeline: {
    bestTimeToBuy: string;
    marketCycle: 'expansion' | 'peak' | 'contraction' | 'recovery';
    cycleReasoning: string;
    daysOnMarket: number;
    negotiationRoom: number;
  };
  mortgageData: {
    typicalRatePct: number;
    downPayment20pct: number;
    monthlyPayment30yr: number;
    totalInterest30yr: number;
  };
  macroFactors: {
    gdpGrowth: number;
    inflationRate: number;
    unemploymentRate: number;
    interestRateTrend: 'rising' | 'stable' | 'falling';
    populationGrowth: number;
  };
  worldBankData: {
    gdpPerCapita: number;
    gdpGrowthPct: number;
    inflationPct: number;
    unemploymentPct: number;
    urbanPopPct: number;
  };
  investmentScenarios: {
    bear: { growth5yr: number; priceIn5yr: number; irr: number; narrative: string };
    base: { growth5yr: number; priceIn5yr: number; irr: number; narrative: string };
    bull: { growth5yr: number; priceIn5yr: number; irr: number; narrative: string };
  };
  regulatoryContext: {
    foreignOwnershipAllowed: boolean;
    foreignOwnershipNotes: string;
    stampDuty: number;
    capitalGainsTax: number;
    annualPropertyTaxPct: number;
  };
  exitStrategy: {
    recommendedHoldPeriod: string;
    liquidityRating: 'high' | 'medium' | 'low';
    expectedResaleTime: number;
    bestExitScenario: string;
  };
  monteCarlo: {
    p5: number;
    p25: number;
    p50: number;
    p75: number;
    p95: number;
  };
}

export interface OracleStore {
  // --- State ---
  location: LocationData | null;
  comparisonLocation: LocationData | null;
  
  propType: PropertyType;
  bedrooms: string;
  purpose: Purpose;
  budget: string;
  holdingPeriod: HoldingPeriod;
  
  mapCenter: [number, number];
  mapZoom: number;
  activeLayers: Set<string>;
  
  analysis: AnalysisV3 | null;
  comparisonAnalysis: AnalysisV3 | null;
  isComparing: boolean;
  
  sourceStatus: Record<DataSource, SourceStatus>;
  
  isAnalyzing: boolean;
  loadingStep: string;
  loadingProgress: number;
  
  activeTab: TabName;
  
  // --- Actions ---
  setLocation: (loc: LocationData | null) => void;
  setComparisonLocation: (loc: LocationData | null) => void;
  setAnalysis: (analysis: AnalysisV3 | null) => void;
  setComparisonAnalysis: (analysis: AnalysisV3 | null) => void;
  setIsComparing: (isComparing: boolean) => void;
  setPropConfig: (config: Partial<{ propType: PropertyType; bedrooms: string; purpose: Purpose; budget: string; holdingPeriod: HoldingPeriod }>) => void;
  setMapCenter: (center: [number, number], zoom?: number) => void;
  toggleLayer: (layer: string) => void;
  setSourceStatus: (source: DataSource, status: SourceStatus) => void;
  setActiveTab: (tab: TabName) => void;
  reset: () => void;
}

export const useOracleStore = create<OracleStore>((set) => ({
  location: null,
  setLocation: (location) => set({ location, mapCenter: location ? [location.lat, location.lon] : [51.505, -0.09] }),
  
  propType: 'Apartment',
  bedrooms: '2 BHK',
  purpose: 'Buy',
  budget: '500000',
  holdingPeriod: '5yr',
  setPropConfig: (config) => set((state) => ({ ...state, ...config })),
  
  mapCenter: [51.505, -0.09],
  mapZoom: 13,
  activeLayers: new Set(['heatmap', 'radius']),
  setMapCenter: (mapCenter, mapZoom) => set((state) => ({ mapCenter, mapZoom: mapZoom || state.mapZoom })),
  toggleLayer: (layer) => set((state) => {
    const next = new Set(state.activeLayers);
    if (next.has(layer)) next.delete(layer);
    else next.add(layer);
    return { activeLayers: next };
  }),
  
  analysis: null,
  comparisonAnalysis: null,
  comparisonLocation: null,
  isComparing: false,
  
  sourceStatus: {
    OSM: 'idle',
    WorldBank: 'idle',
    OpenMeteo: 'idle',
    TensorFlow: 'idle',
    GroqAI: 'idle',
    REST: 'idle',
  },
  setSourceStatus: (source, status) => set((state) => ({
    sourceStatus: { ...state.sourceStatus, [source]: status }
  })),
  
  isAnalyzing: false,
  loadingStep: '',
  loadingProgress: 0,
  
  activeTab: 'overview',
  setActiveTab: (activeTab) => set({ activeTab }),

  setAnalysis: (analysis) => set({ analysis }),
  setComparisonAnalysis: (comparisonAnalysis) => set({ comparisonAnalysis }),
  setComparisonLocation: (comparisonLocation) => set({ comparisonLocation }),
  setIsComparing: (isComparing) => set({ isComparing }),
  
  reset: () => set({
    location: null,
    comparisonLocation: null,
    analysis: null,
    comparisonAnalysis: null,
    isComparing: false,
    isAnalyzing: false,
    loadingStep: '',
    loadingProgress: 0,
    sourceStatus: {
      OSM: 'idle',
      WorldBank: 'idle',
      OpenMeteo: 'idle',
      TensorFlow: 'idle',
      GroqAI: 'idle',
      REST: 'idle',
    }
  }),
}));
