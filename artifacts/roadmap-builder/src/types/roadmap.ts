export type RoadmapMode = 'phase' | 'implementation';

export interface PhaseSubItem {
  id: string;
  number: string; // e.g., "1.1", "1.2"
  description: string;
  startPeriod: number;
  endPeriod: number;
}

export interface Phase {
  id: string;
  number: number;
  name: string;
  color: string;
  subItems: PhaseSubItem[];
}

export interface Milestone {
  id: string;
  label: string;
  periodIndex: number;
  phaseIndex?: number; // For phase roadmap, which phase row to show the milestone on
}

export interface PhaseRoadmapData {
  title: string;
  periods: string[]; // e.g., ["январь", "февраль", "март"]
  currentPosition: number; // Index of "we are here" column
  phases: Phase[];
  milestones: Milestone[];
}

export interface Task {
  id: string;
  description: string;
  startPeriod: number;
  span: number; // How many periods it spans
  notes?: string;
}

export interface Swimlane {
  id: string;
  name: string;
  color: string;
  tasks: Task[];
}

export interface ImplementationMilestone {
  id: string;
  label: string; // ALL CAPS
  periodIndex: number;
}

export interface ImplementationRoadmapData {
  title: string;
  periods: string[]; // e.g., ["1 месяц", "1 месяц", "2 месяца"]
  milestones: ImplementationMilestone[];
  swimlanes: Swimlane[];
}

export type RoadmapData = PhaseRoadmapData | ImplementationRoadmapData;

export interface RoadmapState {
  mode: RoadmapMode;
  phaseData: PhaseRoadmapData;
  implementationData: ImplementationRoadmapData;
}
