import { is } from "@electron-toolkit/utils";
import os from "node:os";
import { join } from "node:path";

export function getMachineId() {
  return os.hostname();
}

export function loadRendererUrl(win: Electron.BrowserWindow | Electron.WebContents, path: string = "index.html") {
  const devServerUrl = process.env["ELECTRON_RENDERER_URL"];
  if (is.dev && devServerUrl) {
    win.loadURL(`${devServerUrl}/${path}`);
  } else {
    win.loadFile(join(__dirname, `../renderer/${path}`));
  }
}
