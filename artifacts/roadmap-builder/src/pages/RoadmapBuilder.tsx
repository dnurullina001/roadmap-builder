import { useState, useEffect } from 'react';
import { RoadmapMode, RoadmapState } from '@/types/roadmap';
import { demoPhaseData, demoImplementationData } from '@/lib/demo-data';
import RoadmapForm from '@/components/form/RoadmapForm';
import PhaseRoadmap from '@/components/roadmap/PhaseRoadmap';
import ImplementationRoadmap from '@/components/roadmap/ImplementationRoadmap';

const STORAGE_KEY = 'roadmap-builder-state';

function loadState(): RoadmapState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }
  
  return {
    mode: 'phase',
    phaseData: demoPhaseData,
    implementationData: demoImplementationData,
  };
}

function saveState(state: RoadmapState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export default function RoadmapBuilder() {
  const [state, setState] = useState<RoadmapState>(loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleReset = () => {
    const resetState: RoadmapState = {
      mode: 'phase',
      phaseData: demoPhaseData,
      implementationData: demoImplementationData,
    };
    setState(resetState);
  };

  const handleExport = () => {
    window.print();
  };

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Left Panel - Form */}
      <div className="w-[35%] shrink-0">
        <RoadmapForm
          mode={state.mode}
          phaseData={state.phaseData}
          implementationData={state.implementationData}
          onModeChange={(mode) => setState({ ...state, mode })}
          onPhaseDataChange={(phaseData) => setState({ ...state, phaseData })}
          onImplementationDataChange={(implementationData) =>
            setState({ ...state, implementationData })
          }
          onReset={handleReset}
          onExport={handleExport}
        />
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 overflow-hidden bg-muted/20">
        {state.mode === 'phase' ? (
          <PhaseRoadmap data={state.phaseData} />
        ) : (
          <ImplementationRoadmap data={state.implementationData} />
        )}
      </div>
    </div>
  );
}
