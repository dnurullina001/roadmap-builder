export type RoadmapMode = 'phase' | 'implementation';

export type ItemStatus = 'done' | 'in-progress' | 'backlog' | 'delayed';

// Assignee is now a plain string key (e.g. 'pm', 'analyst', or any custom id)
export type Assignee = string;

export interface AssigneeRole {
  id: string;
  label: string;
  color: string;
}

export const DEFAULT_ASSIGNEE_ROLES: AssigneeRole[] = [
  { id: 'pm',        label: 'ПМ',           color: '#0048F4' },
  { id: 'analyst',   label: 'Аналитик',     color: '#4472C4' },
  { id: 'developer', label: 'Разработчик',  color: '#ED7D31' },
  { id: 'tester',    label: 'Тестировщик',  color: '#70AD47' },
];

export interface PhaseSubItem {
  id: string;
  description: string;
  startPeriod: number;
  endPeriod: number;        // exclusive: endPeriod=2 means spans periods 0,1
  status: ItemStatus;
  assignees: Assignee[];
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  subItems: PhaseSubItem[];
}

export interface Milestone {
  id: string;
  label: string;
  periodIndex: number;
  phaseIndex?: number;
}

export interface PhaseRoadmapData {
  title: string;
  periods: string[];
  currentPosition: number;
  phases: Phase[];
  milestones: Milestone[];
}

export interface Task {
  id: string;
  description: string;
  startPeriod: number;
  span: number;
  status: ItemStatus;
  assignees: Assignee[];
}

export interface Swimlane {
  id: string;
  name: string;
  tasks: Task[];
}

export interface ImplementationMilestone {
  id: string;
  label: string;
  periodIndex: number;
}

export interface ImplementationRoadmapData {
  title: string;
  periods: string[];
  milestones: ImplementationMilestone[];
  swimlanes: Swimlane[];
}

export type RoadmapData = PhaseRoadmapData | ImplementationRoadmapData;

export interface RoadmapState {
  mode: RoadmapMode;
  phaseData: PhaseRoadmapData;
  implementationData: ImplementationRoadmapData;
  assigneeRoles?: AssigneeRole[];
}
