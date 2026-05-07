import { app, BrowserWindow } from "electron";
import { loadRendererUrl } from "./helpers";
import "./services";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670
  });
  loadRendererUrl(mainWindow);
}

app.whenReady().then(createWindow);
