import { app, BrowserWindow, desktopCapturer } from "electron";
import * as path from "path";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import axios from "axios";
import { ipcMain } from "electron";

let win: BrowserWindow;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    resizable: !app.isPackaged,
    webPreferences: {
      // contextIsolation: false,
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (app.isPackaged) {
    // 'build/index.html'
    win.loadURL(`file://${__dirname}/../index.html`);
    win.removeMenu();
  } else {
    win.loadURL("http://localhost:3000/index.html");

    win.webContents.openDevTools();

    // Hot Reloading on 'node_modules/.bin/electronPath'
    require("electron-reload")(__dirname, {
      electron: path.join(
        __dirname,
        "..",
        "..",
        "node_modules",
        ".bin",
        "electron" + (process.platform === "win32" ? ".cmd" : ""),
      ),
      forceHardReset: true,
      hardResetMethod: "exit",
    });
  }
}

ipcMain.handle("request", async (_, axios_request) => {
  console.log("User Search Request");
  console.log(axios_request);
  const result = await axios(axios_request);
  return { data: result.data, status: result.status };
});

ipcMain.handle("screenshot", async () => {
  console.log("screenshot requested");
  const sources = await desktopCapturer.getSources({ types: ["window", "screen"] });
  return { sources };
});

app.whenReady().then(() => {
  // DevTools
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
