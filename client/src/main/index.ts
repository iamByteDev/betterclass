import { app } from "electron";
import { loadRendererUrl } from "./helpers";
import "./services";
import { createBrowserWindow } from "@/modules/windows";

function createSetupWindow() {
  const mainWindow = createBrowserWindow({
    width: 530,
    height: 450
  });
  loadRendererUrl(mainWindow, "setup.html");
}

app.whenReady().then(createSetupWindow);
