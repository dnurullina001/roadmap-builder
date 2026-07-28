---
name: Electron Windows build rules
description: Hard-won rules for building Electron NSIS installers on GitHub Actions windows-latest; covers icon, encoding, asset paths, and packaging approach.
---

## Rules

### 1. Icon must be `.ico`, not `.png`
NSIS (`makensis.exe`) cannot read PNG files — throws "invalid icon file" and aborts.
**Why:** electron-builder 24.x does NOT auto-convert when `win.icon` or `nsis.installerIcon` is set explicitly.
**How to apply:** Add a CI step before `npm run dist`:
```yaml
- name: Convert PNG icon to ICO
  run: magick "roadmap-electron/build/icon.png" -resize 256x256 "roadmap-electron/build/icon.ico"
```
Then reference `"icon": "build/icon.ico"` in `win` and `nsis` sections of package.json.
`magick` (ImageMagick) is pre-installed on `windows-latest` runners.

### 2. productName and shortcutName must be ASCII
Cyrillic in `productName` or `shortcutName` shows as `??????` in NSIS on Windows runners.
**Why:** NSIS processes strings in its own encoding; GitHub Actions Windows runner locale doesn't handle UTF-8 Cyrillic in NSIS macros.
**How to apply:** Use ASCII for `productName`, `shortcutName`, `description` in electron package.json.
Russian name can still appear in Electron window title (`title: 'Вектор'` in main.js — Electron handles Unicode fine).

### 3. Use `app-dist/` folder, not `extraResources`
Copy web build files directly into `roadmap-electron/app-dist/` and include in `files[]`.
**Why:** `extraResources` in electron-builder 24 is unreliable — path via `process.resourcesPath` can differ.
**How to apply:**
- CI: `uses: actions/download-artifact@v4` with `path: roadmap-electron/app-dist`
- package.json `files`: include `"app-dist/**"`
- main.js: `path.join(__dirname, 'app-dist', 'index.html')` when `app.isPackaged`

### 4. Vite must build with BASE_PATH=./
Electron loads via `file://` — absolute paths like `/assets/main.js` resolve to filesystem root (missing).
**Why:** `loadFile()` makes the working directory the folder of the HTML file; `./assets/...` resolves correctly.
**How to apply:** In CI build step: `env: BASE_PATH: ./`

### 5. asar: false
**Why:** With `asar: true`, `__dirname` inside the asar points to a virtual path; `loadFile` with relative paths breaks.
**How to apply:** Set `"asar": false` in electron-builder `build` config.

### 6. Two-job CI pattern
Job 1 (`ubuntu-latest`): install pnpm workspace, build Vite app, upload artifact.
Job 2 (`windows-latest`): checkout, download artifact into `roadmap-electron/app-dist`, convert icon, `npm install`, `npm run dist`, publish to Releases.
**Why:** pnpm workspace setup is complex on Windows; web build is faster on Linux; keeps jobs isolated.
