'use client';

import { useOracleStore } from '@/store/useOracleStore';
import { orchestrateAnalysis } from '@/lib/analysis/orchestrator';

export const useAnalysis = () => {
  const store = useOracleStore();

  const runAnalysis = async () => {
    if (!store.location || store.isAnalyzing) return;

    useOracleStore.setState({ isAnalyzing: true, loadingProgress: 5 });

    try {
      const results = await orchestrateAnalysis(
        store.location,
        { 
          propType: store.propType, 
          bedrooms: store.bedrooms, 
          purpose: store.purpose, 
          budget: store.budget 
        },
        (step, progress) => {
          useOracleStore.setState({ loadingStep: step, loadingProgress: progress });
        }
      );

      if (store.isComparing) {
        store.setComparisonAnalysis(results.analysis);
        store.setComparisonLocation(store.location);
      } else {
        store.setAnalysis(results.analysis);
      }

      useOracleStore.setState({
        isAnalyzing: false,
        loadingStep: 'Complete',
        loadingProgress: 100,
        activeTab: 'overview'
      });
      
      const nextStatus = { ...store.sourceStatus };
      (Object.keys(nextStatus) as any[]).forEach(src => {
        nextStatus[src as keyof typeof nextStatus] = 'success';
      });
      useOracleStore.setState({ sourceStatus: nextStatus });

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
