import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { location, propConfig, poiSummary, macroSummary, mlResults } = body;

    const systemPrompt = `
      You are HOUSING ORACLE v3.0, an institutional-grade Real Estate Intelligence AI.
      Analyze the provided market data and return an exhaustive JSON report.
      Tone: Bloomberg-style terminal, objective, data-dense, authoritative.
      
      REQUIRED JSON STRUCTURE (follow exactly):
      {
        "marketSummary": "1-sentence executive summary",
        "currentPriceUSD": number,
        "pricePerSqft": number,
        "pricePerSqm": number,
        "rentUSD": number,
        "yoyGrowth": number,
        "projectedGrowth5yr": number,
        "rentalYield": number,
        "annualVolatility": number,
        "marketTrend": "bullish" | "neutral" | "bearish",
        "verdict": "buy" | "wait" | "avoid",
        "confidenceScore": number,
        "verdictHeadline": "Short punchy verdict",
        "verdictReasoning": "Concise reasoning citing data",
        "dataQualityScore": number,
        "mlPriceComment": "Short note on TF.js vs Market",
        "scores": {
          "investment": number, "livability": number, "infrastructure": number, 
          "marketLiquidity": number, "affordability": number, "appreciation": number
        },
        "keyMetrics": {
          "priceToRentRatio": number, "capRate": number, "breakEvenYears": number,
          "cashOnCashReturn": number, "vacancyRate": number, "demandIndex": number,
          "absorptionRate": number, "priceToIncomeRatio": number, "grossRentMultiplier": number
        },
        "neighborhoodInsights": {
          "walkScore": number, "transitScore": number, "safetyScore": number,
          "schoolRating": number, "greenSpaceScore": number, "airQualityScore": number,
          "developmentIndex": number, "floodRiskScore": number
        },
        "poiData": { "schools": number, "hospitals": number, "transit": number, "parks": number, "grocery": number, "fitness": number },
        "risks": ["Risk 1", "Risk 2", "Risk 3"],
        "opportunities": ["Opp 1", "Opp 2", "Opp 3"],
        "comparableAreas": [ { "name": string, "priceUSD": number, "trend": "↑" | "↓" | "→", "yoy": number } ],
        "timeline": {
          "bestTimeToBuy": string, "marketCycle": "expansion" | "peak" | "contraction" | "recovery",
          "cycleReasoning": string, "daysOnMarket": number, "negotiationRoom": number
        },
        "mortgageData": { "typicalRatePct": number, "downPayment20pct": number, "monthlyPayment30yr": number, "totalInterest30yr": number },
        "macroFactors": { "gdpGrowth": number, "inflationRate": number, "unemploymentRate": number, "interestRateTrend": "rising" | "stable" | "falling", "populationGrowth": number },
        "worldBankData": { "gdpPerCapita": number, "gdpGrowthPct": number, "inflationPct": number, "unemploymentPct": number, "urbanPopPct": number },
        "investmentScenarios": {
          "bear": { "growth5yr": number, "priceIn5yr": number, "irr": number, "narrative": string },
          "base": { "growth5yr": number, "priceIn5yr": number, "irr": number, "narrative": string },
          "bull": { "growth5yr": number, "priceIn5yr": number, "irr": number, "narrative": string }
        },
        "regulatoryContext": { "foreignOwnershipAllowed": boolean, "foreignOwnershipNotes": string, "stampDuty": number, "capitalGainsTax": number, "annualPropertyTaxPct": number },
        "exitStrategy": { "recommendedHoldPeriod": string, "liquidityRating": "high" | "medium" | "low", "expectedResaleTime": number, "bestExitScenario": string }
      }
    `;

    const userPrompt = `
      CONTEXT:
      Location: ${location.display}
      Property: ${propConfig.bedrooms} ${propConfig.propType} (${propConfig.purpose})
      POI Data: ${JSON.stringify(poiSummary)}
      Macro WB Data: ${JSON.stringify(macroSummary)}
      Climate Data: ${JSON.stringify(body.climateSummary)}
      ML Baseline: $${mlResults.mlPrice.toLocaleString()}
      Monte Carlo (5Y P50): $${mlResults.monteCarlo.p50.toLocaleString()}
      
      Synthesize the v3.0 Institutional Report now.
    `;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        stream: false,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    const data = await response.json();
    console.log("Groq v3.0 Synthesis Status:", response.status);

    if (!data.choices) throw new Error("Groq API Mismatch");
    
    const content = data.choices[0].message.content;
    return NextResponse.json(JSON.parse(content));

  } catch (e) {
    console.error("Analysis Pipeline Exception:", e);
    return NextResponse.json({ error: "Analysis failed", details: (e as any).message }, { status: 500 });
  }
}
