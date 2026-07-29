import { RoadmapState } from '@/types/roadmap';

const PROJECTS_KEY = 'vektor-projects-v1';
const MAX_VERSIONS = 10;

export interface ProjectVersion {
  id: string;
  savedAt: string;       // ISO date
  label: string;         // "Версия 1", "Правки после встречи" etc.
  state: RoadmapState;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  versions: ProjectVersion[];
}

function loadAll(): SavedProject[] {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(projects: SavedProject[]): void {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function listProjects(): SavedProject[] {
  return loadAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createProject(name: string, state: RoadmapState): SavedProject {
  const now = new Date().toISOString();
  const project: SavedProject = {
    id: `p-${Date.now()}`,
    name,
    createdAt: now,
    updatedAt: now,
    versions: [
      {
        id: `v-${Date.now()}`,
        savedAt: now,
        label: 'Версия 1',
        state,
      },
    ],
  };
  persist([...loadAll(), project]);
  return project;
}

export function saveNewVersion(
  projectId: string,
  state: RoadmapState,
  label?: string
): SavedProject | null {
  const projects = loadAll();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return null;

  const existing = projects[idx];
  const versionNum = existing.versions.length + 1;
  const now = new Date().toISOString();
  const version: ProjectVersion = {
    id: `v-${Date.now()}`,
    savedAt: now,
    label: label || `Версия ${versionNum}`,
    state,
  };

  const updated: SavedProject = {
    ...existing,
    updatedAt: now,
    versions: [...existing.versions, version].slice(-MAX_VERSIONS),
  };
  projects[idx] = updated;
  persist(projects);
  return updated;
}

export function deleteProject(id: string): void {
  persist(loadAll().filter((p) => p.id !== id));
}

export function deleteVersion(projectId: string, versionId: string): void {
  const projects = loadAll();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx === -1) return;
  projects[idx] = {
    ...projects[idx],
    versions: projects[idx].versions.filter((v) => v.id !== versionId),
  };
  persist(projects);
}

export function renameProject(id: string, name: string): void {
  const projects = loadAll();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return;
  projects[idx] = { ...projects[idx], name };
  persist(projects);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
