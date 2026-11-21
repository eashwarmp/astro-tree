/**
 * URL for a file in public/. The app may be served from a sub-path (GitHub Pages serves it at
 * /astro-tree/), so never hard-code a leading "/" for public files: use asset("assets/x.png").
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL + path.replace(/^\//, "");
}
