import { PhaseRoadmapData, ImplementationRoadmapData } from '@/types/roadmap';

export const demoPhaseData: PhaseRoadmapData = {
  title: 'Этапы диагностики рабочих процессов биллинга',
  periods: ['январь', 'февраль', 'март', 'апрель', 'май'],
  currentPosition: 2, // март
  phases: [
    {
      id: 'phase-1',
      number: 1,
      name: 'Сбор и бенчмаркинг',
      color: '#1d4ed8', // navy
      subItems: [
        { id: 'si-1-1', number: '1.1', description: 'Интервью с ключевыми стейкхолдерами', startPeriod: 0, endPeriod: 1 },
        { id: 'si-1-2', number: '1.2', description: 'Анализ текущих процессов и документации', startPeriod: 1, endPeriod: 2 },
        { id: 'si-1-3', number: '1.3', description: 'Бенчмаркинг рынка и конкурентов', startPeriod: 1, endPeriod: 2 },
        { id: 'si-1-4', number: '1.4', description: 'Сбор метрик производительности', startPeriod: 2, endPeriod: 3 },
        { id: 'si-1-5', number: '1.5', description: 'Карта болевых точек и возможностей', startPeriod: 2, endPeriod: 3 },
      ],
    },
    {
      id: 'phase-2',
      number: 2,
      name: 'Диагностика и поиск инициатив',
      color: '#0d9488', // teal
      subItems: [
        { id: 'si-2-1', number: '2.1', description: 'Выявление узких мест в процессах', startPeriod: 2, endPeriod: 3 },
        { id: 'si-2-2', number: '2.2', description: 'Приоритизация инициатив по impact/effort', startPeriod: 2, endPeriod: 3 },
        { id: 'si-2-3', number: '2.3', description: 'Разработка бизнес-кейсов', startPeriod: 3, endPeriod: 4 },
        { id: 'si-2-4', number: '2.4', description: 'Финансовая модель и ROI', startPeriod: 3, endPeriod: 4 },
        { id: 'si-2-5', number: '2.5', description: 'Презентация для руководства', startPeriod: 3, endPeriod: 4 },
      ],
    },
    {
      id: 'phase-3',
      number: 3,
      name: 'Дизайн целевой модели',
      color: '#f59e0b', // amber
      subItems: [
        { id: 'si-3-1', number: '3.1', description: 'Описание целевых процессов to-be', startPeriod: 3, endPeriod: 4 },
        { id: 'si-3-2', number: '3.2', description: 'Roadmap трансформации по фазам', startPeriod: 4, endPeriod: 5 },
        { id: 'si-3-3', number: '3.3', description: 'План внедрения и управление изменениями', startPeriod: 4, endPeriod: 5 },
      ],
    },
  ],
  milestones: [
    { id: 'm-1', label: 'Отчет', periodIndex: 1, phaseIndex: 0 },
    { id: 'm-2', label: 'Одобрение', periodIndex: 3, phaseIndex: 1 },
  ],
};

export const demoImplementationData: ImplementationRoadmapData = {
  title: 'Дорожная карта реализации OCR в ТеДоКа',
  periods: ['1 месяц', '1 месяц', '1 месяц', '2 месяца'],
  milestones: [
    { id: 'im-1', label: 'ПРОТОТИП ГОТОВ', periodIndex: 0 },
    { id: 'im-2', label: 'ВСЕ ПАЙПЛАЙНЫ РАБОТАЮТ', periodIndex: 2 },
    { id: 'im-3', label: 'ВСЕ ШАБЛОНЫ ГОТОВЫ', periodIndex: 3 },
  ],
  swimlanes: [
    {
      id: 'sl-1',
      name: 'Интеграция',
      color: '#1d4ed8',
      tasks: [
        { id: 't-1-1', description: 'API интеграция с OCR сервисом', startPeriod: 0, span: 1 },
        { id: 't-1-2', description: 'Подключение к DMS системе', startPeriod: 1, span: 2, notes: 'Требуется доступ к prod' },
      ],
    },
    {
      id: 'sl-2',
      name: 'Аналитика и экспертиза',
      color: '#0d9488',
      tasks: [
        { id: 't-2-1', description: 'Разработка эталонных шаблонов', startPeriod: 0, span: 2 },
        { id: 't-2-2', description: 'Тестирование точности распознавания', startPeriod: 2, span: 1 },
        { id: 't-2-3', description: 'Настройка правил валидации', startPeriod: 3, span: 1 },
      ],
    },
    {
      id: 'sl-3',
      name: 'Разработка',
      color: '#f59e0b',
      tasks: [
        { id: 't-3-1', description: 'Frontend для загрузки документов', startPeriod: 0, span: 1 },
        { id: 't-3-2', description: 'Backend обработка и очередь', startPeriod: 1, span: 1 },
        { id: 't-3-3', description: 'Интерфейс проверки результатов', startPeriod: 2, span: 2 },
      ],
    },
  ],
};
