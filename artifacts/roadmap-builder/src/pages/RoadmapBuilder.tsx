import { useState, useEffect } from 'react';
import { RoadmapMode, RoadmapState, AssigneeRole, DEFAULT_ASSIGNEE_ROLES } from '@/types/roadmap';
import { demoPhaseData, demoImplementationData } from '@/lib/demo-data';
import RoadmapForm from '@/components/form/RoadmapForm';
import PhaseRoadmap from '@/components/roadmap/PhaseRoadmap';
import ImplementationRoadmap from '@/components/roadmap/ImplementationRoadmap';
import ProjectsModal from '@/components/ProjectsModal';
import SlideCountDialog from '@/components/SlideCountDialog';
import HelpDialog from '@/components/HelpDialog';
import { exportPhaseRoadmapToPptx, exportImplementationRoadmapToPptx } from '@/lib/export-pptx';
import { SavedProject, saveNewVersion } from '@/lib/projects';
import { Maximize2, Minimize2 } from 'lucide-react';

const STORAGE_KEY = 'roadmap-builder-state';
const ACTIVE_PROJECT_KEY = 'vektor-active-project';

function loadState(): RoadmapState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as RoadmapState;
      // Ensure assigneeRoles is populated with defaults if missing
      if (!parsed.assigneeRoles || parsed.assigneeRoles.length === 0) {
        parsed.assigneeRoles = DEFAULT_ASSIGNEE_ROLES;
      }
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return {
    mode: 'implementation',
    phaseData: demoPhaseData,
    implementationData: demoImplementationData,
    assigneeRoles: DEFAULT_ASSIGNEE_ROLES,
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const assigneeRoles: AssigneeRole[] = state.assigneeRoles && state.assigneeRoles.length > 0
    ? state.assigneeRoles
    : DEFAULT_ASSIGNEE_ROLES;

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);
    try {
      if (next && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else if (!next && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } catch {
      // Fullscreen API not available — the in-app expanded layout still applies.
    }
  };

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
      assigneeRoles: DEFAULT_ASSIGNEE_ROLES,
    });
  };

  const handleExport = () => {
    window.print();
  };

  const handleExportPptx = () => {
    setShowSlideDialog(true);
  };

  const handleSlideCountConfirm = (count: number) => {
    setShowSlideDialog(false);
    if (state.mode === 'phase') {
      exportPhaseRoadmapToPptx(state.phaseData, count, assigneeRoles);
    } else {
      exportImplementationRoadmapToPptx(state.implementationData, count, assigneeRoles);
    }
  };

  const handleToggleHideMode = (mode: RoadmapMode) => {
    if (hiddenModes.includes(mode)) {
      setHiddenModes(hiddenModes.filter((m) => m !== mode));
    } else {
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
        setShowProjects(true);
      }
    } else {
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
      {/* Left Panel — Form (hidden in fullscreen preview mode) */}
      {!isFullscreen && (
        <div className="w-[35%] shrink-0 no-print border-r border-border h-full">
          <RoadmapForm
            mode={state.mode}
            phaseData={state.phaseData}
            implementationData={state.implementationData}
            currentProjectId={currentProjectId}
            assigneeRoles={assigneeRoles}
            onModeChange={(mode) => setState((prev) => ({ ...prev, mode }))}
            onPhaseDataChange={(phaseData) => setState((prev) => ({ ...prev, phaseData }))}
            onImplementationDataChange={(implementationData) =>
              setState((prev) => ({ ...prev, implementationData }))
            }
            onAssigneeRolesChange={(roles) => setState((prev) => ({ ...prev, assigneeRoles: roles }))}
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
      )}

      {/* Right Panel — Preview */}
      <div className="flex-1 overflow-hidden bg-[#EBEBEB] flex flex-col relative">
        {/* Fullscreen toggle */}
        <button
          onClick={toggleFullscreen}
          className="no-print absolute top-3 right-3 z-30 flex items-center gap-1.5 h-8 px-3 rounded-md bg-white border border-border shadow-sm text-[11px] font-medium text-foreground hover:bg-muted transition-colors"
          title={isFullscreen ? 'Свернуть (Esc)' : 'Развернуть на весь экран'}
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          {isFullscreen ? 'Свернуть' : 'На весь экран'}
        </button>

        <div className={`flex-1 roadmap-slide ${isFullscreen ? 'overflow-hidden' : 'overflow-auto'}`}>
          {state.mode === 'phase' ? (
            <PhaseRoadmap data={state.phaseData} fullscreen={isFullscreen} assigneeRoles={assigneeRoles} />
          ) : (
            <ImplementationRoadmap data={state.implementationData} fullscreen={isFullscreen} assigneeRoles={assigneeRoles} />
          )}
        </div>

        {/* Status & Assignee Legend */}
        <div className="shrink-0 bg-white border-t border-border px-6 py-3 flex items-center gap-6 flex-wrap text-[11px] font-medium no-print shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Статусы:</span>
            {[
              { label: 'Готово',   bg: '#D6EADD', border: '#70AD47' },
              { label: 'В работе', bg: '#E3ECFB', border: '#4472C4' },
              { label: 'Бэклог',   bg: '#F0F0F0', border: '#A5A5A5' },
              { label: 'Задержка', bg: '#FDECEA', border: '#C62828' },
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

          <div className="w-px h-4 bg-border" />

          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-muted-foreground uppercase tracking-wider text-[10px]">Исполнители:</span>
            {assigneeRoles.map((role) => (
              <div key={role.id} className="flex items-center gap-2">
                <div
                  className="w-5 h-3.5 rounded-[3px] shadow-sm flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: role.color, fontSize: '8px' }}
                >
                  {role.label.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-foreground">{role.label}</span>
              </div>
            ))}
          </div>
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
