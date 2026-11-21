import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./app/Router";
import { registerServiceWorker } from "./lib/pwa";
import { sound } from "./lib/sound";
import "./styles/global.css";

// Browsers only allow audio after a gesture; unlocking on every tap is cheap and also wakes
// audio back up after iOS suspends it. It does nothing while sound is switched off.
window.addEventListener("pointerdown", () => sound.unlock(), { passive: true });
registerServiceWorker();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>,
);
