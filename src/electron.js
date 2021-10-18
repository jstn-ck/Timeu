const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let win;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800, height: 600,
    minHeight: 350,
    minWidth: 500,
    preload: path.join(__dirname, "preload.js"),
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
      nativeWindowOpen: true,
    }
  });

  // and load the index.html of the app.
  win.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  win.webContents.openDevTools();

};

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

// ipcMain.on("toMain", (event, args) => {
//   fs.readFile("path/to/file", (error, data) => {
//     // Do something with file contents

//     // Send result back to renderer process
//     win.webContents.send("fromMain", responseObj);
//   });
// });

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
