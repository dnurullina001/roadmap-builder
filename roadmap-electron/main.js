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

  // Load the built Vite app
  // IMPORTANT: must use loadFile so that relative asset paths (./assets/...)
  // resolve correctly in the file:// context
  const appPath = app.isPackaged
    ? path.join(process.resourcesPath, 'app', 'index.html')
    : path.join(__dirname, '..', 'artifacts', 'roadmap-builder', 'dist', 'public', 'index.html');

  mainWindow.loadFile(appPath).catch((err) => {
    console.error('Failed to load app:', err);
    // Show error page if file not found
    mainWindow.loadURL(`data:text/html,<h2 style="font-family:sans-serif;color:red;padding:40px">
      Ошибка загрузки приложения.<br><small>${err.message}</small>
    </h2>`);
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
