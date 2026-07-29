const { app, BrowserWindow, Menu, protocol, net } = require('electron');
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');

// MUST be called before app.whenReady()
// Registers 'app://' as a secure, standard scheme so that:
//   - ES modules (type="module") load without CORS errors
//   - localStorage / sessionStorage work normally
//   - fetch() inside the app works
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      allowServiceWorkers: true,
    },
  },
]);

let mainWindow;

function getWebRoot() {
  return app.isPackaged
    ? path.join(__dirname, 'app-dist')
    : path.join(__dirname, '..', 'artifacts', 'roadmap-builder', 'dist', 'public');
}

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
    backgroundColor: '#f0f4ff',
  });

  // Load via custom app:// protocol — avoids file:// CORS block on ES modules
  mainWindow.loadURL('app://vektor/').catch((err) => {
    console.error('loadURL failed:', err);
  });

  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  const webRoot = getWebRoot();

  // Serve all files under app://vektor/* from the webRoot folder
  protocol.handle('app', (request) => {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Root → index.html
    if (pathname === '/' || pathname === '') {
      pathname = '/index.html';
    }

    const filePath = path.join(webRoot, pathname);

    // If the file doesn't exist (e.g. SPA deep link), fall back to index.html
    if (!fs.existsSync(filePath)) {
      return net.fetch(pathToFileURL(path.join(webRoot, 'index.html')).toString());
    }

    return net.fetch(pathToFileURL(filePath).toString());
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
