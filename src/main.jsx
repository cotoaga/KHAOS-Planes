import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import KhaosPlanes from "./KhaosPlanes.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <KhaosPlanes />
  </StrictMode>
);
