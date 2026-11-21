import { CONSTELLATIONS } from "../data/constellations";
import type { Sign } from "../data/signs";
import { asset } from "./assets";
import { projectStars } from "./sky";
import type { Drawn } from "./tarot";

// A shareable 1080×1920 "story" image of a reading, drawn with Canvas 2D.

export interface KeepsakeInput {
  sign: Sign;
  date: Date;
  /** e.g. "Moon in Aries, waxing gibbous" */
  moonLine: string;
  /** e.g. "Past · Present · Future" */
  spreadName: string;
  /** 1 or 3 cards. */
  cards: { drawn: Drawn; label: string }[];
}

export const KEEPSAKE_WIDTH = 1080;
export const KEEPSAKE_HEIGHT = 1920;

const W = KEEPSAKE_WIDTH;
const H = KEEPSAKE_HEIGHT;
const INK = "#f4efff";
const INK_DIM = "rgba(244, 239, 255, 0.72)";
const GOLD = "#ffd27a";
const DISPLAY = `"Cinzel Decorative", "Cinzel", Georgia, serif`;
const SERIF = `"Crimson Pro", "Crimson Text", Georgia, serif`;
/** Card images are 300×527. */
const CARD_ASPECT = 527 / 300;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Renders the keepsake as a 1080×1920 PNG. Missing fonts or card images degrade gracefully. */
export async function renderKeepsake(input: KeepsakeInput): Promise<Blob> {
  const [images] = await Promise.all([
    Promise.all(input.cards.map(({ drawn }) => loadImage(asset("assets/tarot/" + drawn.card.image)))),
    loadFonts(),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D is not available");

  const slots = cardSlots(input.cards.length, W);
  const random = seededRandom(`${dayKey(input.date)}:${input.sign.id}`);

  drawBackground(ctx, slots, random);
  drawConstellation(ctx, input.sign.id, { x: (W - 600) / 2, y: 120, w: 600, h: 360 });
  drawHeader(ctx, input);
  input.cards.forEach(({ drawn }, i) => drawCard(ctx, slots[i], drawn, images[i]));
  drawCaptions(ctx, input.cards, slots);

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "rgba(244, 239, 255, 0.4)";
  ctx.font = `700 26px ${DISPLAY}`;
  setLetterSpacing(ctx, "4px");
  ctx.fillText("Astro Tree", W / 2, H - 56);
  setLetterSpacing(ctx, "0px");

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Could not encode keepsake PNG"))), "image/png"),
  );
}

/**
 * Shares the image through the native share sheet where files can be shared, otherwise downloads it.
 * Note: navigator.share needs a recent user gesture; if that has lapsed we fall back to a download.
 */
export async function shareKeepsake(blob: Blob, filename: string, text: string): Promise<"shared" | "downloaded" | "cancelled"> {
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text, title: "Astro Tree" });
      return "shared";
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return "cancelled";
      // NotAllowedError etc.: fall through to a download.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoking synchronously can cancel the download in some browsers.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return "downloaded";
}

// ---------------------------------------------------------------------------------------------
// Pure helpers (unit-tested)

/** Greedy word wrap. `measure` returns a string's rendered width. Words longer than a line overflow. */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && measure(next) > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Wraps a " · "-separated list so that breaks fall between items where possible and no line
 * starts or ends with a separator. An item too long for a line is word-wrapped on its own.
 */
export function wrapList(items: string[], maxWidth: number, measure: (s: string) => number, separator = " · "): string[] {
  const lines: string[] = [];
  let line = "";
  for (const item of items) {
    const next = line ? line + separator + item : item;
    if (measure(next) <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    if (measure(item) <= maxWidth) {
      line = item;
    } else {
      const parts = wrapText(item, maxWidth, measure);
      line = parts.pop() ?? "";
      lines.push(...parts);
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Whether a point lies inside any of the rects. */
export function inAnyRect(x: number, y: number, rects: Rect[]): boolean {
  return rects.some((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h);
}

/** Where each card goes: one large centred card, or a row of up to three. */
export function cardSlots(count: number, width: number): Rect[] {
  if (count <= 1) {
    const w = 420;
    return [{ x: (width - w) / 2, y: 862, w, h: Math.round(w * CARD_ASPECT) }];
  }
  const gap = 44;
  const w = Math.min(290, Math.floor((width - 2 * 50 - gap * (count - 1)) / count));
  const total = count * w + (count - 1) * gap;
  const left = (width - total) / 2;
  return Array.from({ length: count }, (_, i) => ({ x: left + i * (w + gap), y: 860, w, h: Math.round(w * CARD_ASPECT) }));
}

/** Scales and centres 2D points (y up) into a box (y down), preserving aspect ratio. */
export function fitPoints(points: [number, number][], box: Rect): [number, number][] {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = Math.min(box.w / (maxX - minX || 1), box.h / (maxY - minY || 1));
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  return points.map(([x, y]) => [cx + (x - (minX + maxX) / 2) * scale, cy - (y - (minY + maxY) / 2) * scale]);
}

/** Deterministic PRNG (mulberry32) seeded from a string. */
export function seededRandom(seed: string): () => number {
  let a = 2166136261;
  for (let i = 0; i < seed.length; i++) a = Math.imul(a ^ seed.charCodeAt(i), 16777619);
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 2 ** 32;
  };
}

/** The local calendar day, so a reading renders the same all day long. */
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

// ---------------------------------------------------------------------------------------------
// Loading

function loadImage(src: string, timeoutMs = 8000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    const timer = setTimeout(() => resolve(null), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };
    img.src = src;
  });
}

/** Waits for the display fonts, but never longer than `timeoutMs`; the font stacks fall back to Georgia. */
async function loadFonts(timeoutMs = 1500): Promise<void> {
  if (typeof document === "undefined" || !document.fonts) return;
  const fonts = [
    `700 96px "Cinzel Decorative"`,
    `400 40px "Crimson Pro"`,
    `italic 400 40px "Crimson Pro"`,
    `400 40px "Crimson Text"`,
    `italic 400 40px "Crimson Text"`,
  ];
  const all = Promise.allSettled(fonts.map((f) => document.fonts.load(f)));
  await Promise.race([all, new Promise((resolve) => setTimeout(resolve, timeoutMs))]);
}

// ---------------------------------------------------------------------------------------------
// Drawing

function drawBackground(ctx: CanvasRenderingContext2D, slots: Rect[], random: () => number) {
  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#05040d");
  sky.addColorStop(1, "#140c2e");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // Violet glow behind the cards.
  const first = slots[0];
  const last = slots[slots.length - 1];
  const gx = (first.x + last.x + last.w) / 2;
  const gy = first.y + first.h / 2;
  const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, 720);
  glow.addColorStop(0, "rgba(124, 82, 230, 0.34)");
  glow.addColorStop(0.45, "rgba(90, 56, 190, 0.14)");
  glow.addColorStop(1, "rgba(90, 56, 190, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Faint gold haze behind the constellation.
  const halo = ctx.createRadialGradient(W / 2, 300, 0, W / 2, 300, 420);
  halo.addColorStop(0, "rgba(255, 210, 122, 0.07)");
  halo.addColorStop(1, "rgba(255, 210, 122, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, 800);

  // Keep the text areas clear so stray stars don't read as stray punctuation.
  const clear: Rect[] = [
    { x: 140, y: 520, w: W - 280, h: 320 },
    { x: 30, y: last.y + last.h + 10, w: W - 60, h: 340 },
    { x: 380, y: H - 100, w: W - 760, h: 70 },
  ];
  for (let i = 0; i < 250; i++) {
    const x = random() * W;
    const y = random() * H;
    const r = 0.5 + random() ** 3 * 1.9;
    const alpha = 0.25 + random() * 0.65;
    if (inAnyRect(x, y, clear)) continue;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawConstellation(ctx: CanvasRenderingContext2D, signId: Sign["id"], box: Rect) {
  const figure = CONSTELLATIONS[signId];
  const points = fitPoints(
    projectStars(figure.stars).map(([x, y]) => [x, y] as [number, number]),
    box,
  );

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(255, 210, 122, 0.85)";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 210, 122, 0.6)";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  for (const [a, b] of figure.edges) {
    ctx.moveTo(...points[a]);
    ctx.lineTo(...points[b]);
  }
  ctx.stroke();

  figure.stars.forEach((star, i) => {
    const [x, y] = points[i];
    const r = 3.5 + Math.max(0, 4.5 - star.mag) * 1.4;
    const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 4);
    halo.addColorStop(0, "rgba(255, 210, 122, 0.55)");
    halo.addColorStop(1, "rgba(255, 210, 122, 0)");
    ctx.shadowBlur = 0;
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(x, y, r * 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = GOLD;
    ctx.shadowBlur = 16;
    ctx.fillStyle = "#fff6e0";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawHeader(ctx: CanvasRenderingContext2D, { sign, date, moonLine, spreadName }: KeepsakeInput) {
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  ctx.save();
  ctx.fillStyle = INK;
  ctx.shadowColor = "rgba(255, 210, 122, 0.35)";
  ctx.shadowBlur = 24;
  ctx.font = `700 92px ${DISPLAY}`;
  ctx.fillText(sign.name, W / 2, 600, W - 120);
  ctx.restore();

  const day = date.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  ctx.fillStyle = INK_DIM;
  ctx.font = `italic 400 38px ${SERIF}`;
  ctx.fillText(day, W / 2, 664, W - 120);
  ctx.fillText(moonLine, W / 2, 712, W - 120);

  drawOrnament(ctx, W / 2, 762);

  ctx.fillStyle = GOLD;
  ctx.font = `400 30px ${SERIF}`;
  setLetterSpacing(ctx, "5px");
  ctx.fillText(spreadName.toUpperCase(), W / 2, 816, W - 120);
  setLetterSpacing(ctx, "0px");
}

/** A short gold rule with a small diamond in the middle. */
function drawOrnament(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = "rgba(255, 210, 122, 0.55)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - 120, y);
  ctx.lineTo(x - 14, y);
  ctx.moveTo(x + 14, y);
  ctx.lineTo(x + 120, y);
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(x, y - 6);
  ctx.lineTo(x + 6, y);
  ctx.lineTo(x, y + 6);
  ctx.lineTo(x - 6, y);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawCard(ctx: CanvasRenderingContext2D, r: Rect, drawn: Drawn, img: HTMLImageElement | null) {
  const radius = r.w * 0.05;

  // Shadow and a faint gold aura.
  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
  ctx.shadowBlur = 48;
  ctx.shadowOffsetY = 18;
  roundRect(ctx, r, radius);
  ctx.fillStyle = "#0c0820";
  ctx.fill();
  ctx.shadowColor = "rgba(255, 210, 122, 0.22)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 0;
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, r, radius);
  ctx.clip();
  if (img) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    if (drawn.reversed) {
      ctx.translate(r.x + r.w / 2, r.y + r.h / 2);
      ctx.rotate(Math.PI);
      ctx.drawImage(img, -r.w / 2, -r.h / 2, r.w, r.h);
    } else {
      ctx.drawImage(img, r.x, r.y, r.w, r.h);
    }
  } else {
    drawPlaceholder(ctx, r, drawn.card.name);
  }
  ctx.restore();

  ctx.save();
  roundRect(ctx, r, radius);
  ctx.strokeStyle = "rgba(255, 210, 122, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, r: Rect, name: string) {
  const bg = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  bg.addColorStop(0, "#1d1442");
  bg.addColorStop(1, "#0c0820");
  ctx.fillStyle = bg;
  ctx.fillRect(r.x, r.y, r.w, r.h);

  const inset = r.w * 0.07;
  roundRect(ctx, { x: r.x + inset, y: r.y + inset, w: r.w - 2 * inset, h: r.h - 2 * inset }, r.w * 0.03);
  ctx.strokeStyle = "rgba(255, 210, 122, 0.6)";
  ctx.lineWidth = 2;
  ctx.stroke();

  const size = Math.round(r.w * 0.1);
  ctx.fillStyle = GOLD;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `400 ${size}px ${SERIF}`;
  setLetterSpacing(ctx, "3px");
  const lines = wrapText(name.toUpperCase(), r.w - 4 * inset, (s) => ctx.measureText(s).width);
  const lh = size * 1.3;
  lines.forEach((line, i) => ctx.fillText(line, r.x + r.w / 2, r.y + r.h / 2 + (i - (lines.length - 1) / 2) * lh));
  setLetterSpacing(ctx, "0px");
  ctx.textBaseline = "alphabetic";
}

/** Label, name and keywords under each card. */
function drawCaptions(ctx: CanvasRenderingContext2D, cards: KeepsakeInput["cards"], slots: Rect[]) {
  const single = cards.length === 1;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  cards.forEach(({ drawn, label }, i) => {
    const r = slots[i];
    const cx = r.x + r.w / 2;
    const maxWidth = single ? 820 : r.w + 30;
    let y = r.y + r.h + (single ? 76 : 62);

    if (!single) {
      ctx.fillStyle = GOLD;
      ctx.font = `400 26px ${SERIF}`;
      setLetterSpacing(ctx, "4px");
      ctx.fillText(label.toUpperCase(), cx, y, maxWidth);
      setLetterSpacing(ctx, "0px");
      y += 52;
    }

    const nameSize = single ? 50 : 36;
    ctx.fillStyle = INK;
    ctx.font = `400 ${nameSize}px ${SERIF}`;
    const name = drawn.reversed ? [drawn.card.name, "reversed"] : [drawn.card.name];
    y = drawLines(ctx, wrapList(name, maxWidth, (s) => ctx.measureText(s).width), cx, y, nameSize * 1.15);

    const kwSize = single ? 36 : 28;
    y += single ? 12 : 8;
    ctx.fillStyle = INK_DIM;
    ctx.font = `italic 400 ${kwSize}px ${SERIF}`;
    const side = drawn.reversed ? drawn.card.reversed : drawn.card.upright;
    drawLines(ctx, wrapList(side.keywords, maxWidth, (s) => ctx.measureText(s).width), cx, y, kwSize * 1.25);
  });
}

/** Draws lines starting at baseline `y`; returns the baseline of the line after the last. */
function drawLines(ctx: CanvasRenderingContext2D, lines: string[], x: number, y: number, lineHeight: number): number {
  lines.forEach((line, i) => ctx.fillText(line, x, y + i * lineHeight));
  return y + lines.length * lineHeight;
}

function roundRect(ctx: CanvasRenderingContext2D, { x, y, w, h }: Rect, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** letterSpacing is missing from older Safari; there the text is simply unspaced. */
function setLetterSpacing(ctx: CanvasRenderingContext2D, value: string) {
  if ("letterSpacing" in ctx) ctx.letterSpacing = value;
}
