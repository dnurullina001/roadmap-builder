import { ItemStatus, Assignee, ASSIGNEE_LABELS, ASSIGNEE_COLORS } from '@/types/roadmap';

export interface StatusStyle {
  bg: string;
  border: string;
  fg: string;
  label: string;
  icon: string;
}

export const STATUS_STYLES: Record<ItemStatus, StatusStyle> = {
  done:        { bg: '#D6EADD', border: '#70AD47', fg: '#1E5631', label: 'Готово',    icon: '✓' },
  'in-progress':{ bg: '#E3ECFB', border: '#4472C4', fg: '#0D3B7A', label: 'В работе', icon: '●' },
  backlog:     { bg: '#F0F0F0', border: '#A5A5A5', fg: '#444444', label: 'Бэклог',    icon: '○' },
  delayed:     { bg: '#FDECEA', border: '#C62828', fg: '#7F1D1D', label: 'Задержка',  icon: '⚠' },
};

export function getStatusStyle(status: ItemStatus): StatusStyle {
  return STATUS_STYLES[status] || STATUS_STYLES.backlog;
}

export { ASSIGNEE_LABELS, ASSIGNEE_COLORS };
