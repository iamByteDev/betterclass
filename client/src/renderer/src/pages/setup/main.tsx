import "@/index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SetupPage } from "./page";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SetupPage />
  </StrictMode>
);
