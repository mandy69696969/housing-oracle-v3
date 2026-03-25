# Housing Oracle v3.0 — Project Context for AI Assistants

> Use this file to quickly understand the project structure, tech stack, and conventions.

## Quick Overview
**Housing Oracle** is an institutional-grade AI real estate intelligence platform. It analyzes any global property location using ML models, live data APIs, and AI synthesis to produce a comprehensive investment report.

**GitHub:** [mandy69696969/housing-oracle-v3](https://github.com/mandy69696969/housing-oracle-v3)

## Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + CSS variables |
| Charts | Recharts |
| Maps | Leaflet.js |
| 3D | Three.js (header globe) |
| ML | TensorFlow.js (neural net regression) |
| AI | Groq API (llama-3.3-70b-versatile) |
| State | Zustand |
| Animations | Framer Motion |

## Project Structure
```
src/
├── app/
│   ├── page.tsx              # Main dashboard layout
│   ├── layout.tsx            # Root layout with fonts/metadata
│   └── api/analyze/route.ts  # Groq AI synthesis endpoint
├── components/
│   ├── layout/
│   │   ├── Header.tsx        # Top bar with globe, market feed, status badges
│   │   ├── ControlPanel.tsx  # Sidebar: search, config, analyze button
│   │   └── AnalysisPanel.tsx # Main content area with tab system
│   ├── tabs/                 # 10 analysis tabs (overview, trends, ml, scores,
│   │                         #   financial, mortgage, macro, comparable, risk, methodology)
│   ├── globe/MiniGlobe.tsx   # Three.js decorative globe
│   ├── map/                  # Leaflet map components
│   └── ui/                   # Reusable UI: MetricCard, ScoreRing, VerdictBox, etc.
├── hooks/
│   └── useAnalysis.ts        # Analysis orchestration hook
├── lib/
│   ├── analysis/
│   │   └── orchestrator.ts   # Data pipeline: fetch → ML → AI synthesis
│   ├── data/                 # 8 data services:
│   │   ├── nominatim.ts      #   Geocoding (OpenStreetMap)
│   │   ├── overpass.ts       #   POI data (schools, transit, etc.)
│   │   ├── worldbank.ts      #   Macro indicators (GDP, inflation)
│   │   ├── openmeteo.ts      #   Climate/weather data
│   │   ├── openaq.ts         #   Air quality index
│   │   ├── fred.ts           #   US mortgage rates
│   │   ├── imf.ts            #   Global inflation
│   │   ├── restcountries.ts  #   Country metadata
│   │   └── opentopography.ts #   Elevation data
│   ├── ml/
│   │   ├── tfRegression.ts   #   TF.js neural net (8-feature, 20-city training set)
│   │   ├── holtsSmoothing.ts #   Double exponential smoothing
│   │   ├── monteCarlo.ts     #   GBM simulation (2000 paths, 5yr)
│   │   └── financialMath.ts  #   IRR (Newton-Raphson), amortization, ROI
│   └── export/
│       └── pdfService.ts     #   Institutional PDF report generation
└── store/
    └── useOracleStore.ts     # Zustand store (location, analysis, comparison, etc.)
```

## Data Pipeline Flow
```
User Input → geocodeAddress() → orchestrateAnalysis()
  1. Parallel fetch: POI + WorldBank + Climate + FRED + IMF + RestCountries + Elevation
  2. Compute POI scores (walkScore, transitScore, amenityDensity)
  3. Fetch Air Quality
  4. TF.js Neural Net regression → base price
  5. Monte Carlo GBM simulation → confidence intervals
  6. POST /api/analyze → Groq AI synthesis → structured JSON report
  7. Store result in Zustand → render across 10 tabs
```

## Key Conventions
- **Design System:** Bloomberg Terminal meets Revolut. Dark surface theme with warm whites.
- **Fonts:** Instrument Serif (display), DM Mono (data), DM Sans (body)
- **CSS Variables:** `--blue`, `--green`, `--red`, `--surface`, `--surface2`, `--text`, `--text2`, `--text3`, `--border`
- **Cards:** `.fintech-card` class for all data containers
- **Tabs:** 10 tabs managed via `activeTab` in Zustand store
- **Error Handling:** All data services have try/catch with sensible fallbacks — never break the pipeline
- **Type Safety:** All analysis data conforms to the `AnalysisV3` interface in `useOracleStore.ts`

## Environment Variables
```
GROQ_API_KEY=gsk_...  # Required for AI synthesis
```

## Common Commands
```bash
npm run dev    # Start dev server (localhost:3000)
npm run build  # Production build (strict TypeScript checks)
npm run lint   # ESLint
```

## Known Gotchas
1. **FRED CSV** may be CORS-blocked in some browsers → falls back to 6.5% institutional average
2. **OpenAQ v2** is deprecated → service has estimated fallback (PM2.5 = 35 µg/m³)
3. **IMF API** is slow (~3-5s) → has 5s timeout with fallback
4. **World Bank** returns null for some small countries → all fields have fallback values
5. **TF.js model** trains on-the-fly (150 epochs) on first request → ~2s cold start
6. **Overpass API** rate-limited → fallback mock POI data if blocked
