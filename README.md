# Roadmap Builder

Инструмент для быстрого создания профессиональных дорожных карт в корпоративном стиле. Работает в браузере и экспортируется в PowerPoint (PPTX).

## Возможности

- **Два режима**: «По этапам» (Ганта с фазами) и «По потокам» (swimlane)
- **4 статуса задач**: Готово 🟢 | В работе 🔵 | Бэклог ⬜ | Задержка 🔴
- **Исполнители**: ПМ / Аналитик / Разработчик / Тестировщик (можно несколько)
- **Экспорт в PPTX**: слайд 16:9, идеально встаёт в PowerPoint
- **Печать**: только карта, без формы
- **Корпоративные цвета**: синяя палитра #0048F4 / #4472C4
- Данные сохраняются в браузере (localStorage)

## Запуск (веб)

```bash
pnpm install
pnpm --filter @workspace/roadmap-builder run dev
```

Открыть: http://localhost:PORT

## Сборка и запуск как Windows-приложение (.exe)

### Требования
- Node.js 18+
- pnpm

### Шаги

1. **Сборка веб-приложения:**
```bash
# Из корня репозитория
BASE_PATH=/ PORT=3000 pnpm --filter @workspace/roadmap-builder run build
```

2. **Установка зависимостей Electron:**
```bash
cd roadmap-electron
npm install
```

3. **Сборка Windows-инсталлятора:**
```bash
cd roadmap-electron
npm run dist
```

Готовый `.exe` появится в `roadmap-electron/dist-electron/`.

> **Размер**: ~120–150 MB (Electron включает Chromium — это стандарт для desktop-приложений).
> Для портативной версии (без установки): `npm run dist-portable`

### Запуск в режиме разработки (Electron)
```bash
# Сначала сбери веб-приложение (шаг 1 выше), затем:
cd roadmap-electron
npm run start
```

## Структура проекта

```
artifacts/roadmap-builder/   — React + Vite веб-приложение
  src/
    components/
      form/RoadmapForm.tsx          — форма ввода данных
      roadmap/PhaseRoadmap.tsx      — рендер режима «по этапам»
      roadmap/ImplementationRoadmap.tsx — рендер режима «по потокам»
    lib/
      demo-data.ts                  — демо-данные
      export-pptx.ts                — экспорт в PPTX (pptxgenjs)
      status.ts                     — константы статусов и цветов
    types/roadmap.ts                — TypeScript типы
    pages/RoadmapBuilder.tsx        — главная страница

roadmap-electron/             — Electron wrapper для Windows .exe
  main.js                     — точка входа Electron
  package.json                — конфигурация electron-builder
```

## Как использовать

1. Выбери режим (По этапам / По потокам)
2. Введи название проекта
3. Добавь/измени периоды (месяцы, кварталы — любые)
4. Добавь этапы/потоки и задачи внутри них
5. Для каждой задачи укажи статус и исполнителей
6. Нажми **Скачать PPTX** — файл готов к вставке в презентацию

## Лицензия

MIT
