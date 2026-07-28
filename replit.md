# Вектор — Roadmap Builder

Инструмент для создания корпоративных дорожных карт с экспортом в PPTX и сборкой Windows EXE через GitHub Actions.

## Run & Operate

- `pnpm --filter @workspace/roadmap-builder run dev` — запустить веб-приложение
- `pnpm --filter @workspace/roadmap-builder run build` — собрать продакшн-бандл
- `pnpm run typecheck` — проверка типов по всем пакетам

## Stack

- pnpm workspaces, Node.js 22, TypeScript
- Frontend: React + Vite + Tailwind CSS + shadcn/ui
- Export: pptxgenjs (PPTX), window.print() (PDF)
- Desktop: Electron 31 + electron-builder 24 → Windows NSIS installer + ZIP
- Data: localStorage (no server)

## Where things live

- `artifacts/roadmap-builder/` — веб-приложение (React/Vite)
- `artifacts/roadmap-builder/src/lib/export-pptx.ts` — логика PPTX-экспорта
- `artifacts/roadmap-builder/src/lib/demo-data.ts` — демо-данные на русском
- `artifacts/roadmap-builder/src/lib/status.ts` — статусы и исполнители
- `roadmap-electron/` — Electron-обёртка для Windows EXE
- `roadmap-electron/main.js` — точка входа Electron
- `roadmap-electron/build/icon.png` — исходная иконка (CI конвертирует в .ico)
- `.github/workflows/build-exe.yml` — CI: Linux→веб, Windows→EXE→Releases

## Architecture decisions

- `BASE_PATH=./` в Vite-сборке — Electron загружает через `file://`, абсолютные пути `/assets/...` не работают
- `asar: false` в electron-builder — `__dirname` указывает на реальный путь на диске
- Веб-файлы копируются в `roadmap-electron/app-dist/` до сборки (не через `extraResources`)
- CI конвертирует `icon.png → icon.ico` через ImageMagick (`magick` pre-installed on windows-latest)
- `productName` и `shortcutName` — ASCII-only ("Vektor"), русское название только в window title Electron

## User preferences

- Язык интерфейса: русский
- Корпоративная палитра: primary `#0048F4`, navy `#44546A`, amber `#FFC000`
- Никаких внешних трекеров и аналитики
- Все данные только локально — ничего не отправляется на серверы
- GitHub: https://github.com/dnurullina001/
- Токены только через GitHub Secrets, не в коде; после пуша URL очищается

## Gotchas

- NSIS не принимает PNG-иконки — нужен .ico. CI конвертирует через ImageMagick
- Кириллица в `productName` ломает NSIS (показывает `??????`) — только ASCII
- `extraResources` ненадёжен в electron-builder 24 — лучше копировать файлы в папку проекта и включать в `files[]`
- Токен GitHub должен быть удалён из remote URL после пуша (безопасность)
