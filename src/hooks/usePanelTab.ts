import { useSyncExternalStore } from "react";
import { session } from "../lib/env";

export type PanelTab = "today" | "month" | "tarot";

const KEY = "astro-tree:tab";
const listeners = new Set<() => void>();
let current: PanelTab = (session.get(KEY) as PanelTab | null) ?? "today";

/** Selected panel tab, shared so the 3D scene (e.g. tapping the Moon) can switch it too. */
export function setPanelTab(tab: PanelTab) {
  current = tab;
  session.set(KEY, tab);
  listeners.forEach((l) => l());
}

export function usePanelTab(): PanelTab {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => void listeners.delete(l)),
    () => current,
  );
}
