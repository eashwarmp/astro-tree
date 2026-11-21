// Where the HTML panels sit, so the 3D scene can keep the active constellation in the open space.
// Keep these in sync with the media queries in src/styles/global.css and the ui/*.module.css files.

/** Landscape screens (wider than 6:5) get a side panel; everything else gets a bottom sheet. */
export const SIDE_LAYOUT_MIN_ASPECT = 6 / 5;

export const PANEL_MAX_WIDTH = 440;
export const PANEL_WIDTH_FRACTION = 0.46;
export const SHEET_HEIGHT_FRACTION = 0.46;
export const NAV_BAR_HEIGHT = 64;

export interface SkyRect {
  /** Centre of the free area, in normalized device coordinates (-1…1). */
  x: number;
  y: number;
  /** Size of the free area as a fraction of the viewport. */
  width: number;
  height: number;
}

export function freeSkyArea(width: number, height: number): SkyRect {
  if (width / height >= SIDE_LAYOUT_MIN_ASPECT) {
    const panel = Math.min(PANEL_MAX_WIDTH, width * PANEL_WIDTH_FRACTION) + 24;
    const freeW = width - panel;
    const freeH = height - NAV_BAR_HEIGHT;
    return { x: freeW / width - 1, y: NAV_BAR_HEIGHT / height, width: freeW / width, height: freeH / height };
  }
  const top = NAV_BAR_HEIGHT;
  const bottom = height * SHEET_HEIGHT_FRACTION;
  const freeH = height - top - bottom;
  return { x: 0, y: 1 - (2 * (top + freeH / 2)) / height, width: 1, height: freeH / height };
}
