const { app, BrowserWindow, ipcMain } = require('electron');
//const path = require('path');

let win;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1140, height: 650,
    minHeight: 450,
    minWidth: 700,
    titleBarStyle: 'hidden',
    trafficLightPosition: { x: 18, y: 17 },
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    }
  });

  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  win.webContents.openDevTools();

  win.webContents.on('new-window',
    (event, url, frameName, disposition, options, additionalFeatures) => {
      if (frameName === 'Preferences ') {
        event.preventDefault();
        Object.assign(options, {
          // This will prevent interactions with the mainWindow
          parent: win,
          title: frameName,
          width: 400,
          height: 250,
          //`left` and `top` positions possible
        });
        event.newGuest = new BrowserWindow(options);
      }
    });

    win.on('show', () => {
      setTimeout(() => {
        win.focus();
      }, 200);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Future todo: clean typescript ipc handler(requires electron ts file)
const userSettings = app.getPath('userData');

ipcMain.on('get-settings-path', (event, key) => {
  console.log(`Main process recieved ${key}.`);
  const value = userSettings;
  event.sender.send('response', value);
});
