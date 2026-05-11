import { activeWindow } from "get-windows";

let lastRecordedWindowTitle: string | undefined;
let windowData: any
let windowTitle: string | undefined
async function getCurrentWindow() {
  if (windowTitle != lastRecordedWindowTitle) {
    windowData = await activeWindow();
    windowTitle = windowData?.title;
    lastRecordedWindowTitle = windowTitle;
    // TODO: Push to convex
  }
}

setInterval(getCurrentWindow, 1000);
