import { useState } from 'react';
import { RoadmapMode, PhaseRoadmapData, ImplementationRoadmapData, Phase, PhaseSubItem, Swimlane, Task, Milestone, ImplementationMilestone, ItemStatus, Assignee } from '@/types/roadmap';
import { ASSIGNEE_LABELS, ASSIGNEE_COLORS, STATUS_STYLES } from '@/lib/status';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, RotateCcw, Download, Presentation, FolderOpen, Save, HelpCircle, Eye, EyeOff, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface RoadmapFormProps {
  mode: RoadmapMode;
  phaseData: PhaseRoadmapData;
  implementationData: ImplementationRoadmapData;
  currentProjectId: string | null;
  hiddenModes: RoadmapMode[];
  onModeChange: (mode: RoadmapMode) => void;
  onPhaseDataChange: (data: PhaseRoadmapData) => void;
  onImplementationDataChange: (data: ImplementationRoadmapData) => void;
  onReset: () => void;
  onExport: () => void;
  onExportPptx: () => void;
  onOpenProjects: () => void;
  onQuickSave: () => void;
  onShowHelp: () => void;
  onToggleHideMode: (mode: RoadmapMode) => void;
}

const StatusToggle = ({ value, onChange }: { value: ItemStatus; onChange: (status: ItemStatus) => void }) => {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
      {(Object.keys(STATUS_STYLES) as ItemStatus[]).map((status) => {
        const style = STATUS_STYLES[status];
        const isActive = value === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onChange(status)}
            className={`px-1.5 py-0 h-[22px] text-[10px] rounded-sm transition-colors border font-medium whitespace-nowrap`}
            style={{
              backgroundColor: isActive ? style.bg : 'white',
              color: isActive ? style.fg : '#555',
              borderColor: isActive ? style.border : '#E2E8F0',
            }}
          >
            {style.label}
          </button>
        );
      })}
    </div>
  );
};

const AssigneeToggle = ({ values, onChange }: { values: Assignee[]; onChange: (assignees: Assignee[]) => void }) => {
  const toggleAssignee = (role: Assignee) => {
    if (values.includes(role)) {
      onChange(values.filter(v => v !== role));
    } else {
      onChange([...values, role]);
    }
  };

  return (
    <div className="flex gap-1 flex-wrap">
      {(Object.keys(ASSIGNEE_LABELS) as Assignee[]).map((role) => {
        const isActive = values.includes(role);
        return (
          <button
            key={role}
            type="button"
            onClick={() => toggleAssignee(role)}
            className={`px-1.5 py-0 h-[20px] text-[9px] rounded-sm transition-colors border font-medium`}
            style={{
              backgroundColor: isActive ? ASSIGNEE_COLORS[role] : 'white',
              color: isActive ? 'white' : '#555',
              borderColor: isActive ? ASSIGNEE_COLORS[role] : '#E2E8F0',
            }}
          >
            {ASSIGNEE_LABELS[role]}
          </button>
        );
      })}
    </div>
  );
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="w-0.5 h-3 bg-[#0048F4]" />
      <h3 className="text-[10px] uppercase font-bold text-foreground tracking-wider">{title}</h3>
    </div>
  );
}

export default function RoadmapForm({
  mode,
  phaseData,
  implementationData,
  currentProjectId,
  hiddenModes,
  onModeChange,
  onPhaseDataChange,
  onImplementationDataChange,
  onReset,
  onExport,
  onExportPptx,
  onOpenProjects,
  onQuickSave,
  onShowHelp,
  onToggleHideMode,
}: RoadmapFormProps) {
  const [openPhases, setOpenPhases] = useState<Record<string, boolean>>(
    () => Object.fromEntries(phaseData.phases.map(p => [p.id, false]))
  );
  const [openSwimLanes, setOpenSwimLanes] = useState<Record<string, boolean>>(
    () => Object.fromEntries(implementationData.swimlanes.map(s => [s.id, false]))
  );

  const data = mode === 'phase' ? phaseData : implementationData;

  // Phase roadmap handlers
  const updatePhaseTitle = (title: string) => onPhaseDataChange({ ...phaseData, title });
  const updatePhasePeriods = (periods: string[]) => onPhaseDataChange({ ...phaseData, periods });
  const updatePhaseCurrentPosition = (position: number) => onPhaseDataChange({ ...phaseData, currentPosition: position });
  
  const addPhasePeriod = () => updatePhasePeriods([...phaseData.periods, `период ${phaseData.periods.length + 1}`]);
  const removePhasePeriod = (index: number) => onPhaseDataChange({ ...phaseData, periods: phaseData.periods.filter((_, i) => i !== index) });
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
      subItems: [],
    };
    onPhaseDataChange({ ...phaseData, phases: [...phaseData.phases, newPhase] });
  };
  const removePhase = (id: string) => onPhaseDataChange({ ...phaseData, phases: phaseData.phases.filter((p) => p.id !== id) });
  const updatePhase = (id: string, updates: Partial<Phase>) => onPhaseDataChange({ ...phaseData, phases: phaseData.phases.map((p) => p.id === id ? { ...p, ...updates } : p) });

  const addSubItem = (phaseId: string) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    const newSubItem: PhaseSubItem = {
      id: `si-${Date.now()}`,
      description: 'Новая задача',
      startPeriod: 0,
      endPeriod: 1,
      status: 'backlog',
      assignees: [],
    };
    updatePhase(phaseId, { subItems: [...phase.subItems, newSubItem] });
  };
  const removeSubItem = (phaseId: string, itemId: string) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    updatePhase(phaseId, { subItems: phase.subItems.filter((si) => si.id !== itemId) });
  };
  const updateSubItem = (phaseId: string, itemId: string, updates: Partial<PhaseSubItem>) => {
    const phase = phaseData.phases.find((p) => p.id === phaseId);
    if (!phase) return;
    updatePhase(phaseId, { subItems: phase.subItems.map((si) => si.id === itemId ? { ...si, ...updates } : si) });
  };

  const addPhaseMilestone = () => {
    const newMilestone: Milestone = { id: `m-${Date.now()}`, label: 'Веха', periodIndex: 0, phaseIndex: 0 };
    onPhaseDataChange({ ...phaseData, milestones: [...phaseData.milestones, newMilestone] });
  };
  const removePhaseMilestone = (id: string) => onPhaseDataChange({ ...phaseData, milestones: phaseData.milestones.filter((m) => m.id !== id) });
  const updatePhaseMilestone = (id: string, updates: Partial<Milestone>) => onPhaseDataChange({ ...phaseData, milestones: phaseData.milestones.map((m) => m.id === id ? { ...m, ...updates } : m) });

  // Implementation roadmap handlers
  const updateImplTitle = (title: string) => onImplementationDataChange({ ...implementationData, title });
  const updateImplPeriods = (periods: string[]) => onImplementationDataChange({ ...implementationData, periods });
  
  const addImplPeriod = () => updateImplPeriods([...implementationData.periods, '1 месяц']);
  const removeImplPeriod = (index: number) => updateImplPeriods(implementationData.periods.filter((_, i) => i !== index));
  const updateImplPeriod = (index: number, value: string) => {
    const newPeriods = [...implementationData.periods];
    newPeriods[index] = value;
    updateImplPeriods(newPeriods);
  };

  const addImplMilestone = () => {
    const newMilestone: ImplementationMilestone = { id: `im-${Date.now()}`, label: 'НОВАЯ ВЕХА', periodIndex: 0 };
    onImplementationDataChange({ ...implementationData, milestones: [...implementationData.milestones, newMilestone] });
  };
  const removeImplMilestone = (id: string) => onImplementationDataChange({ ...implementationData, milestones: implementationData.milestones.filter((m) => m.id !== id) });
  const updateImplMilestone = (id: string, updates: Partial<ImplementationMilestone>) => onImplementationDataChange({ ...implementationData, milestones: implementationData.milestones.map((m) => m.id === id ? { ...m, ...updates } : m) });

  const addSwimlane = () => {
    const newSwimlane: Swimlane = { id: `sl-${Date.now()}`, name: `Поток ${implementationData.swimlanes.length + 1}`, tasks: [] };
    onImplementationDataChange({ ...implementationData, swimlanes: [...implementationData.swimlanes, newSwimlane] });
  };
  const removeSwimlane = (id: string) => onImplementationDataChange({ ...implementationData, swimlanes: implementationData.swimlanes.filter((s) => s.id !== id) });
  const updateSwimlane = (id: string, updates: Partial<Swimlane>) => onImplementationDataChange({ ...implementationData, swimlanes: implementationData.swimlanes.map((s) => s.id === id ? { ...s, ...updates } : s) });

  const addTask = (swimlaneId: string) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;
    const newTask: Task = { id: `t-${Date.now()}`, description: 'Новая задача', startPeriod: 0, span: 1, status: 'backlog', assignees: [] };
    updateSwimlane(swimlaneId, { tasks: [...swimlane.tasks, newTask] });
  };
  const removeTask = (swimlaneId: string, taskId: string) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;
    updateSwimlane(swimlaneId, { tasks: swimlane.tasks.filter((t) => t.id !== taskId) });
  };
  const updateTask = (swimlaneId: string, taskId: string, updates: Partial<Task>) => {
    const swimlane = implementationData.swimlanes.find((s) => s.id === swimlaneId);
    if (!swimlane) return;
    updateSwimlane(swimlaneId, { tasks: swimlane.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)) });
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-border">
      {/* Header */}
      <div className="px-4 pt-3 pb-2 border-b border-border bg-white shrink-0">
        {/* Brand */}
        <div className="flex items-center justify-between mb-1">
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className="text-[16px] font-bold tracking-tight"
                style={{ color: '#0048F4', fontFamily: 'Times New Roman, serif' }}
              >
                Вектор
              </span>
              {currentProjectId && (
                <span className="text-[9px] bg-[#0048F4]/10 text-[#0048F4] px-1.5 py-0.5 rounded font-medium">
                  сохранено
                </span>
              )}
            </div>
            <p className="text-[9px] text-muted-foreground leading-none mt-0.5">
              Стратегия. Ясность. Движение.
            </p>
          </div>
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenProjects}
              className="h-7 px-2 text-[10px]"
              title="Мои проекты"
            >
              <FolderOpen className="w-3 h-3 mr-1" /> Проекты
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onQuickSave}
              className="h-7 px-2 text-[10px]"
              title="Сохранить версию"
            >
              <Save className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHelp}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-[#0048F4]"
              title="Инструкция"
            >
              <HelpCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Export row */}
        <div className="flex gap-1 mb-2 mt-2">
          <Button variant="outline" size="sm" onClick={onReset} className="h-6 px-2 text-[9px]" title="Сбросить к демо">
            <RotateCcw className="w-2.5 h-2.5" />
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} className="h-6 px-2 text-[9px] flex-1">
            <Download className="w-2.5 h-2.5 mr-1" /> PDF
          </Button>
          <Button size="sm" onClick={onExportPptx} className="h-6 px-2 text-[9px] flex-1 bg-[#0048F4] hover:bg-[#0048F4]/90">
            <Presentation className="w-2.5 h-2.5 mr-1" /> PPTX
          </Button>
        </div>

        {/* Tabs — По потокам first, with per-tab hide (×) buttons */}
        {(() => {
          const allModes: { value: RoadmapMode; label: string }[] = [
            { value: 'implementation', label: 'По потокам' },
            { value: 'phase', label: 'По этапам' },
          ];
          const visibleModes = allModes.filter((m) => !hiddenModes.includes(m.value));
          const hasHidden = hiddenModes.length > 0;

          return (
            <div className="space-y-1">
              {visibleModes.length > 1 ? (
                <Tabs value={mode} onValueChange={(v) => onModeChange(v as RoadmapMode)}>
                  <TabsList className="w-full h-8 bg-muted flex gap-0 p-0.5">
                    {visibleModes.map(({ value, label }) => (
                      <div key={value} className="relative flex-1 h-full flex items-center">
                        <TabsTrigger
                          value={value}
                          className="flex-1 h-full text-[11px] font-medium pr-5"
                        >
                          {label}
                        </TabsTrigger>
                        <button
                          className="absolute right-0.5 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground hover:text-foreground transition-colors z-10"
                          onClick={(e) => { e.stopPropagation(); onToggleHideMode(value); }}
                          title={`Скрыть вид «${label}»`}
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </TabsList>
                </Tabs>
              ) : (
                <div className="flex items-center justify-between bg-muted rounded-md px-3 h-8">
                  <span className="text-[11px] font-semibold text-foreground">
                    {visibleModes[0]?.label ?? ''}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] text-muted-foreground">один вид</span>
                    <button
                      className="p-0.5 rounded hover:bg-muted-foreground/20 text-muted-foreground"
                      onClick={() => onToggleHideMode(hiddenModes[0]!)}
                      title="Показать второй вид"
                    >
                      <EyeOff className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              {hasHidden && visibleModes.length === 1 && (
                <button
                  className="w-full text-[9px] text-[#0048F4] hover:underline text-center py-0.5"
                  onClick={() => onToggleHideMode(hiddenModes[0]!)}
                >
                  + Показать «{allModes.find(m => m.value === hiddenModes[0])?.label}»
                </button>
              )}
            </div>
          );
        })()}
      </div>

      {/* Form Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-5">
          
          {/* Общие настройки */}
          <div>
            <SectionHeader title="Основное" />
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-[10px] text-muted-foreground font-medium">Название проекта</Label>
                <Input
                  value={data.title}
                  onChange={(e) => mode === 'phase' ? updatePhaseTitle(e.target.value) : updateImplTitle(e.target.value)}
                  className="h-7 text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] text-muted-foreground font-medium">Периоды</Label>
                  <Button variant="ghost" size="sm" onClick={mode === 'phase' ? addPhasePeriod : addImplPeriod} className="h-5 px-1.5 text-[10px] text-[#0048F4]">
                    <Plus className="w-2.5 h-2.5 mr-0.5" /> Добавить
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {data.periods.map((period, idx) => (
                    <div key={idx} className="flex items-center border rounded-[4px] pl-2 pr-1 h-6 bg-muted/30">
                      <input
                        value={period}
                        onChange={(e) => mode === 'phase' ? updatePhasePeriod(idx, e.target.value) : updateImplPeriod(idx, e.target.value)}
                        className="w-16 text-[10px] bg-transparent outline-none border-none"
                      />
                      <button onClick={() => mode === 'phase' ? removePhasePeriod(idx) : removeImplPeriod(idx)} className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-2.5 h-2.5 ml-1" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {mode === 'phase' && (
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground font-medium">Мы здесь (текущий период)</Label>
                  <Select value={String(phaseData.currentPosition)} onValueChange={(v) => updatePhaseCurrentPosition(Number(v))}>
                    <SelectTrigger className="h-7 text-[11px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {phaseData.periods.map((period, idx) => (
                        <SelectItem key={idx} value={String(idx)} className="text-[11px]">{period}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-border" />

          {/* Mode specific structures */}
          {mode === 'phase' ? (
            <>
              {/* Phases */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionHeader title="Этапы" />
                  <Button variant="ghost" size="sm" onClick={addPhase} className="h-5 px-1.5 text-[10px] text-[#0048F4]">
                    <Plus className="w-2.5 h-2.5 mr-0.5" /> Добавить
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {phaseData.phases.map((phase, phaseIdx) => {
                    const phaseColor = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'][phaseIdx % 6];
                    return (
                      <Collapsible key={phase.id} open={openPhases[phase.id]} onOpenChange={(open) => setOpenPhases({ ...openPhases, [phase.id]: open })}>
                        <div className="border border-border rounded-[4px] bg-white overflow-hidden shadow-sm">
                          <div className="flex items-center">
                            <CollapsibleTrigger className="flex-1 flex items-center justify-between px-2 py-2 hover:bg-muted/30 group">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-1.5 h-3 rounded-full shrink-0" style={{ backgroundColor: phaseColor }} />
                                <span className="text-[11px] font-bold truncate text-foreground group-hover:text-[#0048F4] transition-colors">
                                  {phase.number}. {phase.name}
                                </span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform mr-1 ${openPhases[phase.id] ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <button
                              type="button"
                              onClick={() => removePhase(phase.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <CollapsibleContent>
                            <div className="p-2 space-y-3 bg-muted/10 border-t border-border">
                              <div className="flex gap-2">
                                <div className="w-12 shrink-0">
                                  <Label className="text-[9px] text-muted-foreground mb-1 block">Номер</Label>
                                  <Input type="number" value={phase.number} onChange={(e) => updatePhase(phase.id, { number: Number(e.target.value) })} className="h-6 text-[10px]" />
                                </div>
                                <div className="flex-1">
                                  <Label className="text-[9px] text-muted-foreground mb-1 block">Название этапа</Label>
                                  <Input value={phase.name} onChange={(e) => updatePhase(phase.id, { name: e.target.value })} className="h-6 text-[10px]" />
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <Label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Задачи этапа</Label>
                                  <button onClick={() => addSubItem(phase.id)} className="text-[9px] text-[#0048F4] font-medium hover:underline flex items-center">
                                    <Plus className="w-2 h-2 mr-0.5" /> задача
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {phase.subItems.map((item) => (
                                    <div key={item.id} className="bg-white border border-border/60 rounded-[4px] p-2 space-y-2 shadow-sm">
                                      <div className="flex gap-1.5 items-start">
                                        <Input
                                          placeholder="Описание задачи"
                                          value={item.description}
                                          onChange={(e) => updateSubItem(phase.id, item.id, { description: e.target.value })}
                                          className="h-6 text-[11px] font-medium flex-1"
                                        />
                                        <button onClick={() => removeSubItem(phase.id, item.id)} className="p-1 text-muted-foreground hover:text-destructive h-6 shrink-0">
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 flex-1 bg-muted/30 rounded px-1.5 h-6">
                                          <span className="text-[9px] text-muted-foreground font-medium shrink-0">С:</span>
                                          <Select value={String(item.startPeriod)} onValueChange={(v) => updateSubItem(phase.id, item.id, { startPeriod: Number(v) })}>
                                            <SelectTrigger className="h-5 border-none shadow-none p-0 text-[10px] focus:ring-0 focus:ring-offset-0 bg-transparent h-auto py-0">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {phaseData.periods.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">{p}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1 bg-muted/30 rounded px-1.5 h-6">
                                          <span className="text-[9px] text-muted-foreground font-medium shrink-0">По:</span>
                                          <Select value={String(item.endPeriod)} onValueChange={(v) => updateSubItem(phase.id, item.id, { endPeriod: Number(v) })}>
                                            <SelectTrigger className="h-5 border-none shadow-none p-0 text-[10px] focus:ring-0 focus:ring-offset-0 bg-transparent h-auto py-0">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {phaseData.periods.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">{p}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>

                                      <StatusToggle value={item.status} onChange={(status) => updateSubItem(phase.id, item.id, { status })} />
                                      <AssigneeToggle values={item.assignees || []} onChange={(assignees) => updateSubItem(phase.id, item.id, { assignees })} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Milestones (Phase) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionHeader title="Вехи" />
                  <Button variant="ghost" size="sm" onClick={addPhaseMilestone} className="h-5 px-1.5 text-[10px] text-[#0048F4]">
                    <Plus className="w-2.5 h-2.5 mr-0.5" /> Добавить
                  </Button>
                </div>
                
                <div className="space-y-1.5">
                  {phaseData.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex flex-col gap-1 border rounded-[4px] p-2 bg-muted/20">
                      <div className="flex gap-1.5">
                        <Input
                          placeholder="Название вехи"
                          value={milestone.label}
                          onChange={(e) => updatePhaseMilestone(milestone.id, { label: e.target.value })}
                          className="h-6 text-[10px] flex-1"
                        />
                        <button onClick={() => removePhaseMilestone(milestone.id)} className="p-1 text-muted-foreground hover:text-destructive h-6">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex gap-1.5">
                        <Select value={String(milestone.periodIndex)} onValueChange={(v) => updatePhaseMilestone(milestone.id, { periodIndex: Number(v) })}>
                          <SelectTrigger className="h-6 text-[10px] flex-1"><SelectValue placeholder="Период" /></SelectTrigger>
                          <SelectContent>
                            {phaseData.periods.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">{p}</SelectItem>)}
                          </SelectContent>
                        </Select>
                        <Select value={String(milestone.phaseIndex ?? 0)} onValueChange={(v) => updatePhaseMilestone(milestone.id, { phaseIndex: Number(v) })}>
                          <SelectTrigger className="h-6 text-[10px] flex-1"><SelectValue placeholder="Строка этапа" /></SelectTrigger>
                          <SelectContent>
                            {phaseData.phases.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">Строка {p.number}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Swimlanes */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionHeader title="Потоки работ" />
                  <Button variant="ghost" size="sm" onClick={addSwimlane} className="h-5 px-1.5 text-[10px] text-[#0048F4]">
                    <Plus className="w-2.5 h-2.5 mr-0.5" /> Добавить
                  </Button>
                </div>
                
                <div className="space-y-2">
                  {implementationData.swimlanes.map((swimlane, swimlaneIdx) => {
                    const swimlaneColor = ['#0048F4', '#4472C4', '#ED7D31', '#70AD47', '#FFC000', '#5B9BD5'][swimlaneIdx % 6];
                    return (
                      <Collapsible key={swimlane.id} open={openSwimLanes[swimlane.id]} onOpenChange={(open) => setOpenSwimLanes({ ...openSwimLanes, [swimlane.id]: open })}>
                        <div className="border border-border rounded-[4px] bg-white overflow-hidden shadow-sm">
                          <div className="flex items-center">
                            <CollapsibleTrigger className="flex-1 flex items-center justify-between px-2 py-2 hover:bg-muted/30 group">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div className="w-1.5 h-3 rounded-full shrink-0" style={{ backgroundColor: swimlaneColor }} />
                                <span className="text-[11px] font-bold truncate text-foreground group-hover:text-[#0048F4] transition-colors">
                                  {swimlane.name}
                                </span>
                              </div>
                              <ChevronDown className={`w-3.5 h-3.5 shrink-0 text-muted-foreground transition-transform mr-1 ${openSwimLanes[swimlane.id] ? 'rotate-180' : ''}`} />
                            </CollapsibleTrigger>
                            <button
                              type="button"
                              onClick={() => removeSwimlane(swimlane.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <CollapsibleContent>
                            <div className="p-2 space-y-3 bg-muted/10 border-t border-border">
                              <div>
                                <Label className="text-[9px] text-muted-foreground mb-1 block">Название потока</Label>
                                <Input value={swimlane.name} onChange={(e) => updateSwimlane(swimlane.id, { name: e.target.value })} className="h-6 text-[10px]" />
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1.5">
                                  <Label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Задачи</Label>
                                  <button onClick={() => addTask(swimlane.id)} className="text-[9px] text-[#0048F4] font-medium hover:underline flex items-center">
                                    <Plus className="w-2 h-2 mr-0.5" /> задача
                                  </button>
                                </div>
                                
                                <div className="space-y-2">
                                  {swimlane.tasks.map((task) => (
                                    <div key={task.id} className="bg-white border border-border/60 rounded-[4px] p-2 space-y-2 shadow-sm">
                                      <div className="flex gap-1.5 items-start">
                                        <Input
                                          placeholder="Описание задачи"
                                          value={task.description}
                                          onChange={(e) => updateTask(swimlane.id, task.id, { description: e.target.value })}
                                          className="h-6 text-[11px] font-medium flex-1"
                                        />
                                        <button onClick={() => removeTask(swimlane.id, task.id)} className="p-1 text-muted-foreground hover:text-destructive h-6 shrink-0">
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <div className="flex items-center gap-1.5 flex-1 bg-muted/30 rounded px-1.5 h-6">
                                          <span className="text-[9px] text-muted-foreground font-medium shrink-0">С:</span>
                                          <Select value={String(task.startPeriod)} onValueChange={(v) => updateTask(swimlane.id, task.id, { startPeriod: Number(v) })}>
                                            <SelectTrigger className="h-5 border-none shadow-none p-0 text-[10px] focus:ring-0 focus:ring-offset-0 bg-transparent h-auto py-0">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {implementationData.periods.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">{p}</SelectItem>)}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-1 bg-muted/30 rounded px-1.5 h-6">
                                          <span className="text-[9px] text-muted-foreground font-medium shrink-0">Длит:</span>
                                          <Input
                                            type="number"
                                            min={1}
                                            max={12}
                                            value={task.span}
                                            onChange={(e) => updateTask(swimlane.id, task.id, { span: Number(e.target.value) || 1 })}
                                            className="h-5 w-8 p-0 text-center text-[10px] border-none shadow-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                                          />
                                        </div>
                                      </div>

                                      <StatusToggle value={task.status} onChange={(status) => updateTask(swimlane.id, task.id, { status })} />
                                      <AssigneeToggle values={task.assignees || []} onChange={(assignees) => updateTask(swimlane.id, task.id, { assignees })} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Milestones (Implementation) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <SectionHeader title="Вехи" />
                  <Button variant="ghost" size="sm" onClick={addImplMilestone} className="h-5 px-1.5 text-[10px] text-[#0048F4]">
                    <Plus className="w-2.5 h-2.5 mr-0.5" /> Добавить
                  </Button>
                </div>
                
                <div className="space-y-1.5">
                  {implementationData.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex gap-1.5 items-center border rounded-[4px] p-1.5 bg-muted/20">
                      <Input
                        placeholder="Название (КАПС)"
                        value={milestone.label}
                        onChange={(e) => updateImplMilestone(milestone.id, { label: e.target.value })}
                        className="h-6 text-[10px] flex-[2]"
                      />
                      <Select value={String(milestone.periodIndex)} onValueChange={(v) => updateImplMilestone(milestone.id, { periodIndex: Number(v) })}>
                        <SelectTrigger className="h-6 text-[10px] flex-[1]"><SelectValue placeholder="Период" /></SelectTrigger>
                        <SelectContent>
                          {implementationData.periods.map((p, idx) => <SelectItem key={idx} value={String(idx)} className="text-[10px]">{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <button onClick={() => removeImplMilestone(milestone.id)} className="p-1 text-muted-foreground hover:text-destructive h-6 shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
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
