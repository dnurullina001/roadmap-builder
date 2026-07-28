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

### 4. Use app:// custom protocol — NEVER loadFile() with ES modules
Chromium in Electron **silently blocks** `type="module"` scripts loaded via `file://` (CORS). React/Vite apps use ES modules → blank white window, zero error messages.
**Why:** This is a Chromium security restriction on the file:// origin; it cannot be worked around with BASE_PATH tricks.
**How to apply:**
```js
// Before app.whenReady():
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true, supportFetchAPI: true } }
]);
// Inside app.whenReady():
protocol.handle('app', (request) => {
  const filePath = path.join(webRoot, new URL(request.url).pathname || 'index.html');
  return net.fetch(pathToFileURL(fs.existsSync(filePath) ? filePath : indexHtml).toString());
});
mainWindow.loadURL('app://vektor/');
```
Set `BASE_PATH: /` in Vite build (absolute /assets/... paths work correctly with app://).

### 5. asar: false
**Why:** With `asar: true`, `__dirname` inside the asar points to a virtual path; relative paths to app-dist break.
**How to apply:** Set `"asar": false` in electron-builder `build` config.

### 6. Two-job CI pattern
Job 1 (`ubuntu-latest`): install pnpm workspace, build Vite app, upload artifact.
Job 2 (`windows-latest`): checkout, download artifact into `roadmap-electron/app-dist`, convert icon, `npm install`, `npm run dist`, publish to Releases.
**Why:** pnpm workspace setup is complex on Windows; web build is faster on Linux; keeps jobs isolated.
