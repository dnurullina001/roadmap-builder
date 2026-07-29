import { ItemStatus, Assignee, DEFAULT_ASSIGNEE_ROLES } from '@/types/roadmap';
import type { AssigneeRole } from '@/types/roadmap';

export interface StatusStyle {
  bg: string;
  border: string;
  fg: string;
  label: string;
  icon: string;
}

export const STATUS_STYLES: Record<ItemStatus, StatusStyle> = {
  done:          { bg: '#D6EADD', border: '#70AD47', fg: '#1E5631', label: 'Готово',   icon: '✓' },
  'in-progress': { bg: '#E3ECFB', border: '#4472C4', fg: '#0D3B7A', label: 'В работе', icon: '●' },
  backlog:       { bg: '#F0F0F0', border: '#A5A5A5', fg: '#444444', label: 'Бэклог',   icon: '○' },
  delayed:       { bg: '#FDECEA', border: '#C62828', fg: '#7F1D1D', label: 'Задержка', icon: '⚠' },
};

export function getStatusStyle(status: ItemStatus): StatusStyle {
  return STATUS_STYLES[status] || STATUS_STYLES.backlog;
}

// Helper: resolve label from custom roles or defaults
export function getAssigneeLabel(id: Assignee, roles?: AssigneeRole[]): string {
  const list = roles && roles.length > 0 ? roles : DEFAULT_ASSIGNEE_ROLES;
  return list.find(r => r.id === id)?.label ?? id;
}

// Helper: resolve color from custom roles or defaults
export function getAssigneeColor(id: Assignee, roles?: AssigneeRole[]): string {
  const list = roles && roles.length > 0 ? roles : DEFAULT_ASSIGNEE_ROLES;
  return list.find(r => r.id === id)?.color ?? '#888888';
}

// Legacy static maps (computed from defaults) for backward compat
export const ASSIGNEE_LABELS: Record<string, string> = Object.fromEntries(
  DEFAULT_ASSIGNEE_ROLES.map(r => [r.id, r.label])
);
export const ASSIGNEE_COLORS: Record<string, string> = Object.fromEntries(
  DEFAULT_ASSIGNEE_ROLES.map(r => [r.id, r.color])
);

export { DEFAULT_ASSIGNEE_ROLES };
export type { AssigneeRole };
