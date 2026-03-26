'use client';

import { useOracleStore } from '@/store/useOracleStore';
import { orchestrateAnalysis } from '@/lib/analysis/orchestrator';
import { LocationData } from '@/store/useOracleStore';

export const useAnalysis = () => {
  const store = useOracleStore();

  const runAnalysis = async (overrideLocation?: LocationData) => {
    const loc = overrideLocation || useOracleStore.getState().location;
    if (!loc || useOracleStore.getState().isAnalyzing) return;

    useOracleStore.setState({ isAnalyzing: true, loadingProgress: 5, loadingStep: 'Initializing...' });

    try {
      const state = useOracleStore.getState();
      const results = await orchestrateAnalysis(
        loc,
        { 
          propType: state.propType, 
          bedrooms: state.bedrooms, 
          purpose: state.purpose, 
          budget: state.budget 
        },
        (step, progress) => {
          useOracleStore.setState({ loadingStep: step, loadingProgress: progress });
        }
      );

      const currentState = useOracleStore.getState();
      if (currentState.isComparing) {
        useOracleStore.setState({ 
          comparisonAnalysis: results.analysis,
          comparisonLocation: loc
        });
      } else {
        useOracleStore.setState({ analysis: results.analysis });
      }

      useOracleStore.setState({
        isAnalyzing: false,
        loadingStep: 'Complete',
        loadingProgress: 100,
        activeTab: 'overview',
        sourceStatus: {
          OSM: 'success',
          WorldBank: 'success',
          OpenMeteo: 'success',
          TensorFlow: 'success',
          GroqAI: 'success',
          REST: 'success',
        }
      });

    } catch (e) {
      console.error("Analysis hook failed", e);
      useOracleStore.setState({ 
        isAnalyzing: false, 
        loadingStep: 'Error in processing' 
      });
    }
  };

  return { runAnalysis };
};
