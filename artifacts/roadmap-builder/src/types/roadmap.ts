export type RoadmapMode = 'phase' | 'implementation';

export type ItemStatus = 'done' | 'in-progress' | 'backlog' | 'delayed';

export type Assignee = 'pm' | 'analyst' | 'developer' | 'tester';

export const ASSIGNEE_LABELS: Record<Assignee, string> = {
  pm: 'ПМ',
  analyst: 'Аналитик',
  developer: 'Разработчик',
  tester: 'Тестировщик',
};

export const ASSIGNEE_COLORS: Record<Assignee, string> = {
  pm: '#0048F4',
  analyst: '#4472C4',
  developer: '#ED7D31',
  tester: '#70AD47',
};

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
}
