import { useState, useEffect } from 'react';
import { RoadmapMode, RoadmapState } from '@/types/roadmap';
import { demoPhaseData, demoImplementationData } from '@/lib/demo-data';
import RoadmapForm from '@/components/form/RoadmapForm';
import PhaseRoadmap from '@/components/roadmap/PhaseRoadmap';
import ImplementationRoadmap from '@/components/roadmap/ImplementationRoadmap';
import { exportPhaseRoadmapToPptx, exportImplementationRoadmapToPptx } from '@/lib/export-pptx';

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

  const handleExportPptx = () => {
    if (state.mode === 'phase') {
      exportPhaseRoadmapToPptx(state.phaseData);
    } else {
      exportImplementationRoadmapToPptx(state.implementationData);
    }
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-background">
      {/* Left Panel - Form */}
      <div className="w-[35%] shrink-0 no-print border-r border-border h-full">
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
          onExportPptx={handleExportPptx}
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
        <div className="shrink-0 bg-white border-t border-border px-6 py-3 flex items-center gap-6 text-[11px] font-medium no-print shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Легенда статусов:</span>
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-[3px] border shadow-sm"
              style={{
                backgroundColor: 'var(--status-done-bg)',
                borderColor: 'var(--status-done-border)',
              }}
            />
            <span className="text-foreground">Готово</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-[3px] border shadow-sm"
              style={{
                backgroundColor: 'var(--status-inprogress-bg)',
                borderColor: 'var(--status-inprogress-border)',
              }}
            />
            <span className="text-foreground">В работе</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-[3px] border shadow-sm"
              style={{
                backgroundColor: 'var(--status-backlog-bg)',
                borderColor: 'var(--status-backlog-border)',
              }}
            />
            <span className="text-foreground">Бэклог</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-3.5 h-3.5 rounded-[3px] border shadow-sm flex items-center justify-center text-[#C62828] text-[8px] font-bold"
              style={{
                backgroundColor: 'var(--status-delayed-bg)',
                borderColor: 'var(--status-delayed-border)',
              }}
            >
              ⚠
            </div>
            <span className="text-foreground">Задержка</span>
          </div>
        </div>
      </div>
    </div>
  );
}
