import { useState } from 'react';
import { RoadmapMode, PhaseRoadmapData, ImplementationRoadmapData, Phase, PhaseSubItem, Swimlane, Task, Milestone, ImplementationMilestone } from '@/types/roadmap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, RotateCcw, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface RoadmapFormProps {
  mode: RoadmapMode;
  phaseData: PhaseRoadmapData;
  implementationData: ImplementationRoadmapData;
  onModeChange: (mode: RoadmapMode) => void;
  onPhaseDataChange: (data: PhaseRoadmapData) => void;
  onImplementationDataChange: (data: ImplementationRoadmapData) => void;
  onReset: () => void;
  onExport: () => void;
}

export default function RoadmapForm({
  mode,
  phaseData,
  implementationData,
  onModeChange,
  onPhaseDataChange,
  onImplementationDataChange,
  onReset,
  onExport,
}: RoadmapFormProps) {
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>({});
  const [openSwimlanes, setOpenSwimLanes] = useState<Record<string, boolean>>({});

  const data = mode === 'phase' ? phaseData : implementationData;
  const updateData = mode === 'phase' ? onPhaseDataChange : onImplementationDataChange;

  // Phase roadmap handlers
  const updatePhaseTitle = (title: string) => {
    onPhaseDataChange({ ...phaseData, title });
  };

  const updatePhasePeriods = (periods: string[]) => {
    onPhaseDataChange({ ...phaseData, periods });
  };

  const updatePhaseCurrentPosition = (position: number) => {
    onPhaseDataChange({ ...phaseData, currentPosition: position });
  };

  const addPhasePeriod = () => {
    updatePhasePeriods([...phaseData.periods, `период ${phaseData.periods.length + 1}`]);
  };

  const removePhasePeriod = (index: number) => {
    const newPeriods = phaseData.periods.filter((_, i) => i !== index);
    onPhaseDataChange({ ...phaseData, periods: newPeriods });
  };

  const updatePhasePeriod = (index: number, value: string) => {
    const newPeriods = [...phaseData.periods];
    newPeriods[index] = value;
    updatePhasePeriods(newPeriods);
  };

  const addPhase = () => {
    const newPhase: Phase = {
      id: `phase-${Date.now()}`,
      number: phaseData.phases.length + 1,
      name: `Новый этап ${phaseData.phases.length + 1}`,
      color: '#64748b',
      subItems: [],
    };
    onPhaseDataChange({ ...phaseData, phases: [...phaseData.phases, newPhase] });
  };

  const removePhase = (id: string) => {
    const newPhases = phaseData.phases.filter((p) => p.id !== id);
    onPhaseDataChange({ ...phaseData, phases: newPhases });
  };

  const updatePhase = (id: string, updates: Partial<Phase>) => {
    const newPhases = phaseData.phases.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    onPhaseDataChange({ ...phaseData, phases: newPhases });
  };

  const addSubItem = (phaseId: string) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;

    const newSubItem: PhaseSubItem = {
      id: `si-${Date.now()}`,
      number: `${phase.number}.${phase.subItems.length + 1}`,
      description: 'Новая задача',
      startPeriod: 0,
      endPeriod: 1,
    };

    updatePhase(phaseId, {
      subItems: [...phase.subItems, newSubItem],
    });
  };

  const removeSubItem = (phaseId: string, itemId: string) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;

    updatePhase(phaseId, {
      subItems: phase.subItems.filter((si) => si.id !== itemId),
    });
  };

  const updateSubItem = (phaseId: string, itemId: string, updates: Partial<PhaseSubItem>) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;

    updatePhase(phaseId, {
      subItems: phase.subItems.map((si) =>
        si.id === itemId ? { ...si, ...updates } : si
      ),
    });
  };

  const addPhaseMilestone = () => {
    const newMilestone: Milestone = {
      id: `m-${Date.now()}`,
      label: 'Веха',
      periodIndex: 0,
      phaseIndex: 0,
    };
    onPhaseDataChange({ ...phaseData, milestones: [...phaseData.milestones, newMilestone] });
  };

  const removePhaseMilestone = (id: string) => {
    onPhaseDataChange({
      ...phaseData,
      milestones: phaseData.milestones.filter((m) => m.id !== id),
    });
  };

  const updatePhaseMilestone = (id: string, updates: Partial<Milestone>) => {
    onPhaseDataChange({
      ...phaseData,
      milestones: phaseData.milestones.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  // Implementation roadmap handlers
  const updateImplTitle = (title: string) => {
    onImplementationDataChange({ ...implementationData, title });
  };

  const updateImplPeriods = (periods: string[]) => {
    onImplementationDataChange({ ...implementationData, periods });
  };

  const addImplPeriod = () => {
    updateImplPeriods([...implementationData.periods, '1 месяц']);
  };

  const removeImplPeriod = (index: number) => {
    const newPeriods = implementationData.periods.filter((_, i) => i !== index);
    updateImplPeriods(newPeriods);
  };

  const updateImplPeriod = (index: number, value: string) => {
    const newPeriods = [...implementationData.periods];
    newPeriods[index] = value;
    updateImplPeriods(newPeriods);
  };

  const addImplMilestone = () => {
    const newMilestone: ImplementationMilestone = {
      id: `im-${Date.now()}`,
      label: 'НОВАЯ ВЕХА',
      periodIndex: 0,
    };
    onImplementationDataChange({
      ...implementationData,
      milestones: [...implementationData.milestones, newMilestone],
    });
  };

  const removeImplMilestone = (id: string) => {
    onImplementationDataChange({
      ...implementationData,
      milestones: implementationData.milestones.filter((m) => m.id !== id),
    });
  };

  const updateImplMilestone = (id: string, updates: Partial<ImplementationMilestone>) => {
    onImplementationDataChange({
      ...implementationData,
      milestones: implementationData.milestones.map((m) =>
        m.id === id ? { ...m, ...updates } : m
      ),
    });
  };

  const addSwimlane = () => {
    const newSwimlane: Swimlane = {
      id: `sl-${Date.now()}`,
      name: `Поток ${implementationData.swimlanes.length + 1}`,
      color: '#64748b',
      tasks: [],
    };
    onImplementationDataChange({
      ...implementationData,
      swimlanes: [...implementationData.swimlanes, newSwimlane],
    });
  };

  const removeSwimlane = (id: string) => {
    onImplementationDataChange({
      ...implementationData,
      swimlanes: implementationData.swimlanes.filter((s) => s.id !== id),
    });
  };

  const updateSwimlane = (id: string, updates: Partial<Swimlane>) => {
    onImplementationDataChange({
      ...implementationData,
      swimlanes: implementationData.swimlanes.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
    });
  };

  const addTask = (swimlaneId: string) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;

    const newTask: Task = {
      id: `t-${Date.now()}`,
      description: 'Новая задача',
      startPeriod: 0,
      span: 1,
    };

    updateSwimlane(swimlaneId, {
      tasks: [...swimlane.tasks, newTask],
    });
  };

  const removeTask = (swimlaneId: string, taskId: string) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;

    updateSwimlane(swimlaneId, {
      tasks: swimlane.tasks.filter((t) => t.id !== taskId),
    });
  };

  const updateTask = (swimlaneId: string, taskId: string, updates: Partial<Task>) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;

    updateSwimlane(swimlaneId, {
      tasks: swimlane.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
    });
  };

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-sidebar-border">
      {/* Header */}
      <div className="px-4 py-3 border-b border-sidebar-border bg-sidebar shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Roadmap Builder</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-7 px-2 text-xs"
              data-testid="button-reset"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              className="h-7 px-2 text-xs"
              data-testid="button-export"
            >
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(v) => onModeChange(v as RoadmapMode)}>
          <TabsList className="w-full grid grid-cols-2 h-8">
            <TabsTrigger value="phase" className="text-xs" data-testid="tab-phase">
              Phase
            </TabsTrigger>
            <TabsTrigger value="implementation" className="text-xs" data-testid="tab-implementation">
              Implementation
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-medium">
              Project Title
            </Label>
            <Input
              id="title"
              value={data.title}
              onChange={(e) =>
                mode === 'phase'
                  ? updatePhaseTitle(e.target.value)
                  : updateImplTitle(e.target.value)
              }
              className="h-8 text-xs"
              data-testid="input-title"
            />
          </div>

          {/* Time Periods */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Time Periods</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={mode === 'phase' ? addPhasePeriod : addImplPeriod}
                className="h-6 px-2 text-xs"
                data-testid="button-add-period"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-1.5">
              {data.periods.map((period, idx) => (
                <div key={idx} className="flex gap-1.5">
                  <Input
                    value={period}
                    onChange={(e) =>
                      mode === 'phase'
                        ? updatePhasePeriod(idx, e.target.value)
                        : updateImplPeriod(idx, e.target.value)
                    }
                    className="h-7 text-xs flex-1"
                    data-testid={`input-period-${idx}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      mode === 'phase' ? removePhasePeriod(idx) : removeImplPeriod(idx)
                    }
                    className="h-7 w-7 p-0"
                    data-testid={`button-remove-period-${idx}`}
                  >
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {mode === 'phase' && (
            <>
              {/* Current Position */}
              <div className="space-y-1.5">
                <Label htmlFor="currentPos" className="text-xs font-medium">
                  "We are here" Position
                </Label>
                <Select
                  value={String(phaseData.currentPosition)}
                  onValueChange={(v) => updatePhaseCurrentPosition(Number(v))}
                >
                  <SelectTrigger id="currentPos" className="h-8 text-xs" data-testid="select-current-position">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {phaseData.periods.map((period, idx) => (
                      <SelectItem key={idx} value={String(idx)}>
                        {period}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Phases */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Phases</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addPhase}
                    className="h-6 px-2 text-xs"
                    data-testid="button-add-phase"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Phase
                  </Button>
                </div>
                <div className="space-y-2">
                  {phaseData.phases.map((phase) => (
                    <Collapsible
                      key={phase.id}
                      open={openPhases[phase.id]}
                      onOpenChange={(open) =>
                        setOpenPhases({ ...openPhases, [phase.id]: open })
                      }
                    >
                      <div className="border border-border rounded-sm bg-card">
                        <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-muted/50">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: phase.color }}
                            />
                            <span className="text-xs font-medium truncate">
                              {phase.number}. {phase.name}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-3 h-3 shrink-0 transition-transform ${
                              openPhases[phase.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-2 pb-2 space-y-2 border-t border-border pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Number</Label>
                                <Input
                                  type="number"
                                  value={phase.number}
                                  onChange={(e) =>
                                    updatePhase(phase.id, {
                                      number: Number(e.target.value),
                                    })
                                  }
                                  className="h-6 text-xs"
                                  data-testid={`input-phase-number-${phase.id}`}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Color</Label>
                                <Input
                                  type="color"
                                  value={phase.color}
                                  onChange={(e) =>
                                    updatePhase(phase.id, { color: e.target.value })
                                  }
                                  className="h-6 p-0 border-0"
                                  data-testid={`input-phase-color-${phase.id}`}
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-[10px]">Name</Label>
                              <Input
                                value={phase.name}
                                onChange={(e) =>
                                  updatePhase(phase.id, { name: e.target.value })
                                }
                                className="h-6 text-xs"
                                data-testid={`input-phase-name-${phase.id}`}
                              />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-[10px]">Sub-items</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addSubItem(phase.id)}
                                  className="h-5 px-1.5 text-[10px]"
                                  data-testid={`button-add-subitem-${phase.id}`}
                                >
                                  <Plus className="w-2.5 h-2.5 mr-0.5" />
                                  Add
                                </Button>
                              </div>
                              <div className="space-y-1">
                                {phase.subItems.map((item) => (
                                  <div
                                    key={item.id}
                                    className="bg-muted/50 rounded p-1.5 space-y-1"
                                  >
                                    <div className="flex gap-1">
                                      <Input
                                        placeholder="Number"
                                        value={item.number}
                                        onChange={(e) =>
                                          updateSubItem(phase.id, item.id, {
                                            number: e.target.value,
                                          })
                                        }
                                        className="h-5 text-[10px] w-16"
                                        data-testid={`input-subitem-number-${item.id}`}
                                      />
                                      <Input
                                        placeholder="Description"
                                        value={item.description}
                                        onChange={(e) =>
                                          updateSubItem(phase.id, item.id, {
                                            description: e.target.value,
                                          })
                                        }
                                        className="h-5 text-[10px] flex-1"
                                        data-testid={`input-subitem-description-${item.id}`}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeSubItem(phase.id, item.id)}
                                        className="h-5 w-5 p-0"
                                        data-testid={`button-remove-subitem-${item.id}`}
                                      >
                                        <Trash2 className="w-2.5 h-2.5 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                      <div className="space-y-0.5">
                                        <Label className="text-[9px]">Start</Label>
                                        <Select
                                          value={String(item.startPeriod)}
                                          onValueChange={(v) =>
                                            updateSubItem(phase.id, item.id, {
                                              startPeriod: Number(v),
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-5 text-[10px]" data-testid={`select-subitem-start-${item.id}`}>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {phaseData.periods.map((p, idx) => (
                                              <SelectItem key={idx} value={String(idx)}>
                                                {p}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-0.5">
                                        <Label className="text-[9px]">End</Label>
                                        <Select
                                          value={String(item.endPeriod)}
                                          onValueChange={(v) =>
                                            updateSubItem(phase.id, item.id, {
                                              endPeriod: Number(v),
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-5 text-[10px]" data-testid={`select-subitem-end-${item.id}`}>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {phaseData.periods.map((p, idx) => (
                                              <SelectItem key={idx} value={String(idx)}>
                                                {p}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removePhase(phase.id)}
                              className="h-6 w-full text-xs"
                              data-testid={`button-remove-phase-${phase.id}`}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove Phase
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Milestones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Milestones</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addPhaseMilestone}
                    className="h-6 px-2 text-xs"
                    data-testid="button-add-milestone"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {phaseData.milestones.map((milestone) => (
                    <div key={milestone.id} className="bg-muted/50 rounded p-2 space-y-1.5">
                      <div className="flex gap-1.5">
                        <Input
                          placeholder="Label"
                          value={milestone.label}
                          onChange={(e) =>
                            updatePhaseMilestone(milestone.id, { label: e.target.value })
                          }
                          className="h-6 text-xs flex-1"
                          data-testid={`input-milestone-label-${milestone.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhaseMilestone(milestone.id)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-remove-milestone-${milestone.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <div className="space-y-0.5">
                          <Label className="text-[10px]">Period</Label>
                          <Select
                            value={String(milestone.periodIndex)}
                            onValueChange={(v) =>
                              updatePhaseMilestone(milestone.id, {
                                periodIndex: Number(v),
                              })
                            }
                          >
                            <SelectTrigger className="h-6 text-xs" data-testid={`select-milestone-period-${milestone.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {phaseData.periods.map((p, idx) => (
                                <SelectItem key={idx} value={String(idx)}>
                                  {p}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-[10px]">Phase Row</Label>
                          <Select
                            value={String(milestone.phaseIndex ?? 0)}
                            onValueChange={(v) =>
                              updatePhaseMilestone(milestone.id, {
                                phaseIndex: Number(v),
                              })
                            }
                          >
                            <SelectTrigger className="h-6 text-xs" data-testid={`select-milestone-phase-${milestone.id}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {phaseData.phases.map((phase, idx) => (
                                <SelectItem key={phase.id} value={String(idx)}>
                                  {phase.number}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {mode === 'implementation' && (
            <>
              {/* Implementation Milestones */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Milestones</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addImplMilestone}
                    className="h-6 px-2 text-xs"
                    data-testid="button-add-impl-milestone"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-1.5">
                  {implementationData.milestones.map((milestone) => (
                    <div key={milestone.id} className="bg-muted/50 rounded p-2 space-y-1.5">
                      <div className="flex gap-1.5">
                        <Input
                          placeholder="LABEL (ALL CAPS)"
                          value={milestone.label}
                          onChange={(e) =>
                            updateImplMilestone(milestone.id, {
                              label: e.target.value.toUpperCase(),
                            })
                          }
                          className="h-6 text-xs flex-1 uppercase"
                          data-testid={`input-impl-milestone-label-${milestone.id}`}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImplMilestone(milestone.id)}
                          className="h-6 w-6 p-0"
                          data-testid={`button-remove-impl-milestone-${milestone.id}`}
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-[10px]">Period</Label>
                        <Select
                          value={String(milestone.periodIndex)}
                          onValueChange={(v) =>
                            updateImplMilestone(milestone.id, {
                              periodIndex: Number(v),
                            })
                          }
                        >
                          <SelectTrigger className="h-6 text-xs" data-testid={`select-impl-milestone-period-${milestone.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {implementationData.periods.map((p, idx) => (
                              <SelectItem key={idx} value={String(idx)}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Swimlanes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium">Swimlanes</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addSwimlane}
                    className="h-6 px-2 text-xs"
                    data-testid="button-add-swimlane"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Swimlane
                  </Button>
                </div>
                <div className="space-y-2">
                  {implementationData.swimlanes.map((swimlane) => (
                    <Collapsible
                      key={swimlane.id}
                      open={openSwimLanes[swimlane.id]}
                      onOpenChange={(open) =>
                        setOpenSwimLanes({ ...openSwimLanes, [swimlane.id]: open })
                      }
                    >
                      <div className="border border-border rounded-sm bg-card">
                        <CollapsibleTrigger className="w-full flex items-center justify-between px-2 py-1.5 hover:bg-muted/50">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <div
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: swimlane.color }}
                            />
                            <span className="text-xs font-medium truncate">
                              {swimlane.name}
                            </span>
                          </div>
                          <ChevronDown
                            className={`w-3 h-3 shrink-0 transition-transform ${
                              openSwimLanes[swimlane.id] ? 'rotate-180' : ''
                            }`}
                          />
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-2 pb-2 space-y-2 border-t border-border pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-[10px]">Name</Label>
                                <Input
                                  value={swimlane.name}
                                  onChange={(e) =>
                                    updateSwimlane(swimlane.id, { name: e.target.value })
                                  }
                                  className="h-6 text-xs"
                                  data-testid={`input-swimlane-name-${swimlane.id}`}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-[10px]">Color</Label>
                                <Input
                                  type="color"
                                  value={swimlane.color}
                                  onChange={(e) =>
                                    updateSwimlane(swimlane.id, { color: e.target.value })
                                  }
                                  className="h-6 p-0 border-0"
                                  data-testid={`input-swimlane-color-${swimlane.id}`}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Label className="text-[10px]">Tasks</Label>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addTask(swimlane.id)}
                                  className="h-5 px-1.5 text-[10px]"
                                  data-testid={`button-add-task-${swimlane.id}`}
                                >
                                  <Plus className="w-2.5 h-2.5 mr-0.5" />
                                  Add
                                </Button>
                              </div>
                              <div className="space-y-1">
                                {swimlane.tasks.map((task) => (
                                  <div
                                    key={task.id}
                                    className="bg-muted/50 rounded p-1.5 space-y-1"
                                  >
                                    <div className="flex gap-1">
                                      <Input
                                        placeholder="Description"
                                        value={task.description}
                                        onChange={(e) =>
                                          updateTask(swimlane.id, task.id, {
                                            description: e.target.value,
                                          })
                                        }
                                        className="h-5 text-[10px] flex-1"
                                        data-testid={`input-task-description-${task.id}`}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeTask(swimlane.id, task.id)}
                                        className="h-5 w-5 p-0"
                                        data-testid={`button-remove-task-${task.id}`}
                                      >
                                        <Trash2 className="w-2.5 h-2.5 text-destructive" />
                                      </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-1">
                                      <div className="space-y-0.5">
                                        <Label className="text-[9px]">Start</Label>
                                        <Select
                                          value={String(task.startPeriod)}
                                          onValueChange={(v) =>
                                            updateTask(swimlane.id, task.id, {
                                              startPeriod: Number(v),
                                            })
                                          }
                                        >
                                          <SelectTrigger className="h-5 text-[10px]" data-testid={`select-task-start-${task.id}`}>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {implementationData.periods.map((p, idx) => (
                                              <SelectItem key={idx} value={String(idx)}>
                                                {p}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-0.5">
                                        <Label className="text-[9px]">Span</Label>
                                        <Input
                                          type="number"
                                          min="1"
                                          value={task.span}
                                          onChange={(e) =>
                                            updateTask(swimlane.id, task.id, {
                                              span: Number(e.target.value),
                                            })
                                          }
                                          className="h-5 text-[10px]"
                                          data-testid={`input-task-span-${task.id}`}
                                        />
                                      </div>
                                    </div>
                                    <div className="space-y-0.5">
                                      <Label className="text-[9px]">Notes (optional)</Label>
                                      <Input
                                        placeholder="Notes"
                                        value={task.notes || ''}
                                        onChange={(e) =>
                                          updateTask(swimlane.id, task.id, {
                                            notes: e.target.value,
                                          })
                                        }
                                        className="h-5 text-[10px]"
                                        data-testid={`input-task-notes-${task.id}`}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeSwimlane(swimlane.id)}
                              className="h-6 w-full text-xs"
                              data-testid={`button-remove-swimlane-${swimlane.id}`}
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remove Swimlane
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
