const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 1100,
    minHeight: 700,
    title: 'Вектор',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#f8f8f8',
  });

  // When packaged: web files are copied into app-dist/ alongside main.js
  // __dirname in a packaged app = the folder where the .exe unpacks Electron resources
  // (NOT inside asar — we set asar:false, so __dirname is the real resources path)
  const indexHtml = app.isPackaged
    ? path.join(__dirname, 'app-dist', 'index.html')
    : path.join(__dirname, '..', 'artifacts', 'roadmap-builder', 'dist', 'public', 'index.html');

  console.log('Loading:', indexHtml);

  mainWindow.loadFile(indexHtml).catch((err) => {
    console.error('Failed to load app:', err);
    mainWindow.loadURL(
      'data:text/html,' +
        encodeURIComponent(
          `<html><body style="font-family:sans-serif;padding:40px;background:#fff">
            <h2 style="color:#c00">Ошибка загрузки приложения</h2>
            <p>Путь: <code>${indexHtml}</code></p>
            <p>${err.message}</p>
          </body></html>`
        )
    );
  });

  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
