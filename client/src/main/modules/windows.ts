import { BrowserWindow, BrowserWindowConstructorOptions } from "electron";
import path from "node:path";

export function createBrowserWindow(options: BrowserWindowConstructorOptions = {}, showOnReady: boolean = true) {
  const window = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false
    },
    show: !showOnReady,
    ...options
  });

  if (showOnReady) {
    window.on("ready-to-show", () => {
      window.show();
      window.focus();
    });
  }

  return window;
}
