import { useState, useEffect } from 'react';
import { RoadmapMode, RoadmapState } from '@/types/roadmap';
import { demoPhaseData, demoImplementationData } from '@/lib/demo-data';
import RoadmapForm from '@/components/form/RoadmapForm';
import PhaseRoadmap from '@/components/roadmap/PhaseRoadmap';
import ImplementationRoadmap from '@/components/roadmap/ImplementationRoadmap';
import ProjectsModal from '@/components/ProjectsModal';
import SlideCountDialog from '@/components/SlideCountDialog';
import HelpDialog from '@/components/HelpDialog';
import { exportPhaseRoadmapToPptx, exportImplementationRoadmapToPptx } from '@/lib/export-pptx';
import { SavedProject, saveNewVersion } from '@/lib/projects';

const STORAGE_KEY = 'roadmap-builder-state';
const ACTIVE_PROJECT_KEY = 'vektor-active-project';

function loadState(): RoadmapState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return {
    mode: 'implementation', // По потокам is now the default first tab
    phaseData: demoPhaseData,
    implementationData: demoImplementationData,
  };
}

function saveState(state: RoadmapState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export default function RoadmapBuilder() {
  const [state, setState] = useState<RoadmapState>(loadState);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_PROJECT_KEY);
  });
  const [showProjects, setShowProjects] = useState(false);
  const [showSlideDialog, setShowSlideDialog] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hiddenModes, setHiddenModes] = useState<RoadmapMode[]>([]);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem(ACTIVE_PROJECT_KEY, currentProjectId);
    } else {
      localStorage.removeItem(ACTIVE_PROJECT_KEY);
    }
  }, [currentProjectId]);

  const handleReset = () => {
    setState({
      mode: 'implementation',
      phaseData: demoPhaseData,
      implementationData: demoImplementationData,
    });
  };

  // Wrap data-change handlers with functional setState to avoid stale closures
  // when many phases/swimlanes exist and React batches updates.

  const handleExport = () => {
    window.print();
  };

  // Opens the slide-count dialog before exporting PPTX
  const handleExportPptx = () => {
    setShowSlideDialog(true);
  };

  const handleSlideCountConfirm = (count: number) => {
    setShowSlideDialog(false);
    if (state.mode === 'phase') {
      exportPhaseRoadmapToPptx(state.phaseData, count);
    } else {
      exportImplementationRoadmapToPptx(state.implementationData, count);
    }
  };

  // Quick-save: save current state as new version of active project,
  // or prompt to create a new one if none is active
  const handleToggleHideMode = (mode: RoadmapMode) => {
    if (hiddenModes.includes(mode)) {
      // Restore
      setHiddenModes(hiddenModes.filter((m) => m !== mode));
    } else {
      // Hide — if it's the currently active mode, switch to the other
      const other: RoadmapMode = mode === 'phase' ? 'implementation' : 'phase';
      if (state.mode === mode) {
        setState({ ...state, mode: other });
      }
      setHiddenModes([...hiddenModes, mode]);
    }
  };

  const handleQuickSave = () => {
    if (currentProjectId) {
      const updated = saveNewVersion(currentProjectId, state);
      if (updated) {
        // Brief visual feedback — just open the projects modal to confirm
        setShowProjects(true);
      }
    } else {
      // No active project → open projects modal so user can create/choose one
      setShowProjects(true);
    }
  };

  const handleProjectLoad = (loadedState: RoadmapState, projectId: string) => {
    setState(loadedState);
    setCurrentProjectId(projectId);
  };

  const handleProjectCreated = (project: SavedProject) => {
    setCurrentProjectId(project.id);
  };

  const handleVersionSaved = (project: SavedProject) => {
    setCurrentProjectId(project.id);
  };

  return (
    <div className="h-[100dvh] flex overflow-hidden bg-background">
      {/* Left Panel — Form */}
      <div className="w-[35%] shrink-0 no-print border-r border-border h-full">
        <RoadmapForm
          mode={state.mode}
          phaseData={state.phaseData}
          implementationData={state.implementationData}
          currentProjectId={currentProjectId}
          onModeChange={(mode) => setState((prev) => ({ ...prev, mode }))}
          onPhaseDataChange={(phaseData) => setState((prev) => ({ ...prev, phaseData }))}
          onImplementationDataChange={(implementationData) =>
            setState((prev) => ({ ...prev, implementationData }))
          }
          onReset={handleReset}
          onExport={handleExport}
          onExportPptx={handleExportPptx}
          onOpenProjects={() => setShowProjects(true)}
          onQuickSave={handleQuickSave}
          onShowHelp={() => setShowHelp(true)}
          hiddenModes={hiddenModes}
          onToggleHideMode={handleToggleHideMode}
        />
      </div>

      {/* Right Panel — Preview */}
      <div className="flex-1 overflow-hidden bg-[#EBEBEB] flex flex-col">
        <div className="flex-1 overflow-auto roadmap-slide">
          {state.mode === 'phase' ? (
            <PhaseRoadmap data={state.phaseData} />
          ) : (
            <ImplementationRoadmap data={state.implementationData} />
          )}
        </div>

        {/* Status Legend */}
        <div className="shrink-0 bg-white border-t border-border px-6 py-3 flex items-center gap-6 text-[11px] font-medium no-print shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Статусы:</span>
          {[
            { label: 'Готово', bg: 'var(--status-done-bg)', border: 'var(--status-done-border)' },
            { label: 'В работе', bg: 'var(--status-inprogress-bg)', border: 'var(--status-inprogress-border)' },
            { label: 'Бэклог', bg: 'var(--status-backlog-bg)', border: 'var(--status-backlog-border)' },
            { label: 'Задержка', bg: 'var(--status-delayed-bg)', border: 'var(--status-delayed-border)' },
          ].map(({ label, bg, border }) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="w-3.5 h-3.5 rounded-[3px] border shadow-sm"
                style={{ backgroundColor: bg, borderColor: border }}
              />
              <span className="text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Projects Modal */}
      <ProjectsModal
        open={showProjects}
        onClose={() => setShowProjects(false)}
        currentState={state}
        currentProjectId={currentProjectId}
        onLoad={handleProjectLoad}
        onProjectCreated={handleProjectCreated}
        onVersionSaved={handleVersionSaved}
      />

      {/* Slide count dialog */}
      <SlideCountDialog
        open={showSlideDialog}
        onConfirm={handleSlideCountConfirm}
        onCancel={() => setShowSlideDialog(false)}
      />

      {/* Help dialog */}
      <HelpDialog open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
