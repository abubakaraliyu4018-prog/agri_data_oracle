import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Catch third-party browser extension unhandled rejections (MetaMask, etc.)
// to prevent them from crashing the preview iframe.
window.addEventListener("unhandledrejection", (event) => {
  const reason = event.reason?.message ?? String(event.reason ?? "");
  if (
    /Failed to connect to MetaMask|nkbihfbeogaeaoehlefnkodbefgpgknn|chrome-extension:\/\/|moz-extension:\/\//i.test(reason)
  ) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);