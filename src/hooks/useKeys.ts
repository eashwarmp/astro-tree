import { useEffect, useRef } from "react";

/** Calls `handlers[event.key]` on keydown, always with the latest handlers. */
export function useKeys(handlers: Record<string, () => void>) {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable]")) return;
      const handler = latest.current[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
