import { activeWindow } from "get-windows";

let lastRecordedWindowTitle: string | undefined;

async function getCurrentWindow() {
  let windowData = await activeWindow();
  let windowTitle = windowData?.title;
  if (windowTitle != lastRecordedWindowTitle) {
    lastRecordedWindowTitle = windowTitle;
    // TODO: Push to convex
  }
}

setInterval(getCurrentWindow, 1000);
