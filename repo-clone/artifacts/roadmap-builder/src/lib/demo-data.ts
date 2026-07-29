import { PhaseRoadmapData, ImplementationRoadmapData } from '@/types/roadmap';

export const demoPhaseData: PhaseRoadmapData = {
  title: 'Этапы диагностики рабочих процессов биллинга',
  periods: ['янв', 'фев', 'мар', 'апр', 'май'],
  currentPosition: 2,
  phases: [
    {
      id: 'phase-1',
      number: 1,
      name: 'Сбор и бенчмаркинг',
      subItems: [
        { id: 'si-1-1', description: 'Интервью со стейкхолдерами', startPeriod: 0, endPeriod: 1, status: 'done', assignees: ['pm', 'analyst'] },
        { id: 'si-1-2', description: 'Сбор текущей документации', startPeriod: 0, endPeriod: 1, status: 'done', assignees: ['analyst'] },
        { id: 'si-1-3', description: 'Анализ процессов "as-is"', startPeriod: 1, endPeriod: 2, status: 'in-progress', assignees: ['analyst', 'developer'] },
        { id: 'si-1-4', description: 'Бенчмаркинг с лучшими практиками', startPeriod: 1, endPeriod: 2, status: 'in-progress', assignees: ['pm'] },
        { id: 'si-1-5', description: 'Формирование реестра проблем', startPeriod: 2, endPeriod: 3, status: 'backlog', assignees: ['pm', 'analyst'] },
      ],
    },
    {
      id: 'phase-2',
      number: 2,
      name: 'Диагностика и поиск инициатив',
      subItems: [
        { id: 'si-2-1', description: 'Глубинная аналитика узких мест', startPeriod: 2, endPeriod: 3, status: 'in-progress', assignees: ['analyst'] },
        { id: 'si-2-delay', description: 'Получение данных от смежных подразделений', startPeriod: 1, endPeriod: 2, status: 'delayed', assignees: ['pm'] },
        { id: 'si-2-2', description: 'Формирование пула инициатив', startPeriod: 2, endPeriod: 3, status: 'in-progress', assignees: ['developer', 'analyst'] },
        { id: 'si-2-3', description: 'Оценка бизнес-эффекта', startPeriod: 3, endPeriod: 4, status: 'backlog', assignees: ['pm', 'analyst'] },
        { id: 'si-2-4', description: 'Приоритизация по матрице Ценность/Сложность', startPeriod: 3, endPeriod: 4, status: 'backlog', assignees: ['pm'] },
        { id: 'si-2-5', description: 'Защита пула инициатив', startPeriod: 4, endPeriod: 5, status: 'backlog', assignees: ['pm', 'developer'] },
      ],
    },
    {
      id: 'phase-3',
      number: 3,
      name: 'Дизайн целевой модели',
      subItems: [
        { id: 'si-3-1', description: 'Проектирование процессов "to-be"', startPeriod: 3, endPeriod: 4, status: 'backlog', assignees: ['analyst', 'developer'] },
        { id: 'si-3-2', description: 'Разработка архитектурного решения', startPeriod: 4, endPeriod: 5, status: 'backlog', assignees: ['developer', 'tester'] },
        { id: 'si-3-3', description: 'Формирование детальной дорожной карты внедрения', startPeriod: 4, endPeriod: 5, status: 'backlog', assignees: ['pm'] },
      ],
    },
  ],
  milestones: [
    { id: 'm-1', label: 'Отчет о проблемах', periodIndex: 2, phaseIndex: 0 },
    { id: 'm-2', label: 'Утверждение инициатив', periodIndex: 4, phaseIndex: 1 },
  ],
};

export const demoImplementationData: ImplementationRoadmapData = {
  title: 'Дорожная карта реализации OCR в ТеДоКа',
  periods: ['мес 1', 'мес 2', 'мес 3', 'мес 4', 'мес 5'],
  milestones: [
    { id: 'im-1', label: 'ПРОТОТИП API ГОТОВ', periodIndex: 0 },
    { id: 'im-2', label: 'ТЕСТИРОВАНИЕ НАЧАТО', periodIndex: 2 },
    { id: 'im-3', label: 'ЗАПУСК В ПРОМ', periodIndex: 4 },
  ],
  swimlanes: [
    {
      id: 'sl-1',
      name: 'Интеграция',
      tasks: [
        { id: 't-1-1', description: 'Настройка шлюза к OCR', startPeriod: 0, span: 1, status: 'done', assignees: ['developer'] },
        { id: 't-1-2', description: 'Интеграция с DMS (документооборот)', startPeriod: 1, span: 2, status: 'in-progress', assignees: ['developer', 'analyst'] },
        { id: 't-1-3', description: 'Мониторинг доступности сервиса', startPeriod: 3, span: 2, status: 'backlog', assignees: ['pm', 'developer'] },
      ],
    },
    {
      id: 'sl-2',
      name: 'Аналитика',
      tasks: [
        { id: 't-2-1', description: 'Сбор эталонных документов (500+)', startPeriod: 0, span: 2, status: 'done', assignees: ['analyst'] },
        { id: 't-2-2', description: 'Разметка полей', startPeriod: 1, span: 1, status: 'delayed', assignees: ['analyst'] },
        { id: 't-2-3', description: 'Оценка качества распознавания', startPeriod: 2, span: 2, status: 'in-progress', assignees: ['analyst', 'tester'] },
      ],
    },
    {
      id: 'sl-3',
      name: 'Разработка',
      tasks: [
        { id: 't-3-1', description: 'UI загрузки документов', startPeriod: 0, span: 1, status: 'done', assignees: ['developer'] },
        { id: 't-3-2', description: 'Сервис очереди обработки', startPeriod: 1, span: 2, status: 'in-progress', assignees: ['developer'] },
        { id: 't-3-3', description: 'Интерфейс ручной верификации', startPeriod: 1, span: 3, status: 'in-progress', assignees: ['developer'] }, // Overlaps with t-3-2
        { id: 't-3-4', description: 'Аудит и логирование действий', startPeriod: 3, span: 2, status: 'backlog', assignees: ['developer'] },
      ],
    },
    {
      id: 'sl-4',
      name: 'Тестирование',
      tasks: [
        { id: 't-4-1', description: 'Подготовка тест-кейсов', startPeriod: 1, span: 1, status: 'done', assignees: ['tester'] },
        { id: 't-4-2', description: 'Функциональное тестирование', startPeriod: 2, span: 2, status: 'in-progress', assignees: ['tester'] },
        { id: 't-4-3', description: 'Нагрузочное тестирование (JMeter)', startPeriod: 3, span: 1, status: 'backlog', assignees: ['tester', 'developer'] },
        { id: 't-4-4', description: 'UAT тестирование', startPeriod: 4, span: 1, status: 'backlog', assignees: ['pm', 'tester', 'analyst'] },
      ],
    },
  ],
};
