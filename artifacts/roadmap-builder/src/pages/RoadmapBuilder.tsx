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
      <div className="w-[35%] shrink-0 no-print">
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
      <div className="flex-1 overflow-hidden bg-[#EBEBEB] flex flex-col">
        {/* Roadmap Preview */}
        <div className="flex-1 overflow-auto roadmap-slide">
          {state.mode === 'phase' ? (
            <PhaseRoadmap data={state.phaseData} />
          ) : (
            <ImplementationRoadmap data={state.implementationData} />
          )}
        </div>

        {/* Status Legend */}
        <div className="shrink-0 bg-white border-t border-border px-6 py-3 flex items-center gap-6 text-xs no-print">
          <span className="text-muted-foreground font-medium">Легенда:</span>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border"
              style={{
                backgroundColor: 'var(--status-done-bg)',
                borderColor: 'var(--status-done-border)',
              }}
            />
            <span className="text-foreground">Готово</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border"
              style={{
                backgroundColor: 'var(--status-inprogress-bg)',
                borderColor: 'var(--status-inprogress-border)',
              }}
            />
            <span className="text-foreground">В работе</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-sm border"
              style={{
                backgroundColor: 'var(--status-backlog-bg)',
                borderColor: 'var(--status-backlog-border)',
              }}
            />
            <span className="text-foreground">Бэклог</span>
          </div>
        </div>
      </div>
    </div>
  );
}
