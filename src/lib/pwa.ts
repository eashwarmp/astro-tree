/**
 * Registers the hand-written service worker in `public/sw.js`.
 * Production only: in dev a SW would cache Vite's unhashed modules and fight HMR.
 * Uses BASE_URL so it works both at `/` and under the GitHub Pages sub-path.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const base = import.meta.env.BASE_URL;
  const register = () => {
    navigator.serviceWorker.register(`${base}sw.js`, { scope: base }).catch((error: unknown) => {
      console.warn("Service worker registration failed:", error);
    });
  };

  // Wait for `load` so registration and precaching don't compete with first paint.
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
