const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

if (isDev) {
  let installExtension, REACT_DEVELOPER_TOOLS;

  const devTools = require("electron-devtools-installer");
  installExtension = devTools.default;
  REACT_DEVELOPER_TOOLS = devTools.REACT_DEVELOPER_TOOLS;

  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  function createWindow() {
    const win = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true
      }
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Open the DevTools.
    if (isDev) {
      win.webContents.openDevTools();
    }
  }

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(error => console.log(`An error occurred: , ${error}`));
    }
  });
}
