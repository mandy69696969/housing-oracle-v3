import { fetchPOIData } from '../data/overpass';
import { fetchWorldBankData } from '../data/worldbank';
import { fetchClimateData } from '../data/openmeteo';
import { fetchOpenAQData } from '../data/openaq';
import { fetchFREDData } from '../data/fred';
import { fetchIMFData } from '../data/imf';
import { fetchRestCountries } from '../data/restcountries';
import { fetchElevation } from '../data/opentopography';
import { modelInstance } from '../ml/tfRegression';
import { holtsSmoothing } from '../ml/holtsSmoothing';
import { runMonteCarlo } from '../ml/monteCarlo';

export const orchestrateAnalysis = async (
  location: any, 
  propConfig: any,
  onProgress: (step: string, progress: number) => void
) => {
  try {
    const countryName = location.country || location.display.split(',').pop()?.trim() || 'USA';
    const cc = location.countryCode || 'US';
    
    // 1. Parallel Data Fetching
    onProgress("Fetching multi-vector institutional data...", 20);
    const [poi, macro, climate, fredRate, imfData, restCountry, elevation] = await Promise.all([
      fetchPOIData(location.lat, location.lon),
      fetchWorldBankData(cc),
      fetchClimateData(location.lat, location.lon),
      fetchFREDData(),
      fetchIMFData(),
      fetchRestCountries(countryName),
      fetchElevation(location.lat, location.lon)
    ]);
    
    // 2. Compute POI Scores
    const poiScores = {
      walkScore: Math.min(100, (poi.categories.dining?.length || 0) * 3 + (poi.categories.grocery?.length || 0) * 8 + (poi.categories.transit?.length || 0) * 4 + (poi.categories.parks?.length || 0) * 5),
      transitScore: Math.min(100, (poi.categories.transit?.length || 0) * 7),
      amenityDensity: Math.min(100, poi.count * 1.1),
    };

    // 3. Air Quality
    onProgress("Retrieving live air quality index...", 60);
    const city = location.city || location.display.split(',')[0];
    const aq = await fetchOpenAQData(city);
    
    // 4. ML Regression (TensorFlow.js)
    onProgress("Running Neural Net institutional valuation...", 75);
    const bedroomCount = parseInt(propConfig.bedrooms) || 1; // "Studio" → NaN → 1
    const featureVector = [
      poiScores.transitScore / 100,
      poiScores.amenityDensity / 100,
      (macro.gdpPerCapita) / 100000,
      (macro.inflation) / 10,
      (macro.gdpGrowth) / 5,
      bedroomCount / 5,
      2 / 5, // propertyTypeCode placeholder
      Math.min(1, elevation / 5000) 
    ];
    
    const mlPrice = await modelInstance.predict(featureVector);
    
    // 5. Monte Carlo Simulations (GBM)
    onProgress("Executing Monte Carlo simulations...", 85);
    const mcResults = runMonteCarlo(mlPrice, 5, 12, 5, 2000);

    // 6. AI Synthesis (Groq)
    onProgress("Final AI Oracle Synthesis...", 95);
    const aiResponse = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        location,
        propConfig,
        poiSummary: { 
          schools: poi.categories.schools.length,
          hospitals: poi.categories.hospitals.length,
          transit: poi.categories.transit.length,
          dining: poi.categories.dining.length,
          parks: poi.categories.parks.length,
          grocery: poi.categories.grocery.length,
          total: poi.count
        },
        poiScores,
        macroSummary: { ...macro, fredRate, imfData, restCountry, elevation },
        climateSummary: climate,
        aqSummary: aq,
        mlResults: { 
          mlPrice, 
          monteCarlo: { p5: mcResults.p5, p50: mcResults.p50, p95: mcResults.p95 } 
        }
      })
    });
    
    if (!aiResponse.ok) throw new Error("AI Synthesis Failed");
    const aiResult = await aiResponse.json();
    
    return {
      poi,
      macro,
      climate,
      mlPrice,
      monteCarlo: mcResults,
      analysis: aiResult
    };

  } catch (e) {
    console.error("Analysis Orchestration Failure:", e);
    throw e;
  }
};
