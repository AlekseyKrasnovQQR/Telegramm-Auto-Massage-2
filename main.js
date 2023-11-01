const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const childProcess = require('child_process');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 });

  // Загрузка вашей локальной HTML страницы (или любой другой страницы) в браузерное окно
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Открываем сервер Node.js
  const serverProcess = childProcess.spawn('node', ['server.js']);

  // Обработчик закрытия окна браузера
  mainWindow.on('closed', function () {
    mainWindow = null;
    
    // Завершаем сервер, когда окно закрывается
    serverProcess.kill();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});


