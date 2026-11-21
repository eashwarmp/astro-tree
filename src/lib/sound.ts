// Optional, synthesized UI sounds. Off by default; every call is a silent no-op until the
// reader turns sound on and a user gesture has unlocked the AudioContext (iOS requires one).

import { useSyncExternalStore } from "react";
import { local } from "./env";

const KEY = "astro-tree:sound";
const MASTER = 0.12; // about -18 dB
const STALE_MS = 300; // drop a sound if the context took longer than this to resume

interface Graph {
  ctx: AudioContext;
  master: GainNode;
  reverb: ConvolverNode;
  noise: AudioBuffer;
  riffle: AudioBuffer;
}

let on: boolean | null = null;
let graph: Graph | null = null;
let riffle: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let riffleWanted = false;
const listeners = new Set<() => void>();

function isOn(): boolean {
  if (on === null) on = local.get(KEY) === "on";
  return on;
}

function setOn(next: boolean) {
  if (next === isOn()) return;
  on = next;
  local.set(KEY, next ? "on" : "off");
  if (!next) {
    riffleStop();
    graph?.ctx.suspend().catch(() => {});
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function audioContextClass(): typeof AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  return window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
}

function unlock() {
  if (!isOn()) return;
  if (!graph) {
    const Ctx = audioContextClass();
    if (!Ctx) return;
    try {
      graph = build(new Ctx({ latencyHint: "interactive" }));
    } catch {
      return;
    }
  }
  if (graph.ctx.state !== "running") graph.ctx.resume().catch(() => {});
}

function build(ctx: AudioContext): Graph {
  const master = ctx.createGain();
  master.gain.value = MASTER;
  master.connect(ctx.destination);

  const reverb = ctx.createConvolver();
  reverb.buffer = impulse(ctx, 2.2);
  reverb.connect(master);

  // A one-sample silent buffer started inside the gesture fully unlocks older iOS Safari.
  const blip = ctx.createBufferSource();
  blip.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  blip.connect(ctx.destination);
  blip.start();

  return { ctx, master, reverb, noise: whiteNoise(ctx, 2), riffle: riffleLoop(ctx, 3) };
}

/** Runs `play` now if the context is live, or right after it resumes if that happens quickly. */
function run(play: (g: Graph) => void) {
  const g = graph;
  if (!isOn() || !g) return;
  if (g.ctx.state === "running") {
    play(g);
    return;
  }
  const asked = performance.now();
  g.ctx.resume().then(
    () => {
      if (isOn() && graph === g && g.ctx.state === "running" && performance.now() - asked < STALE_MS) play(g);
    },
    () => {},
  );
}

/** A voice bus feeding the master directly plus a `wet` share into the reverb. */
function voice(g: Graph, wet: number): GainNode {
  const v = g.ctx.createGain();
  v.connect(g.master);
  const send = g.ctx.createGain();
  send.gain.value = wet;
  v.connect(send).connect(g.reverb);
  return v;
}

/** A sine (or other) partial with a short attack and exponential-style decay. */
function partial(g: Graph, dest: AudioNode, freq: number, t: number, peak: number, decay: number, attack = 0.012) {
  const osc = g.ctx.createOscillator();
  osc.frequency.value = freq;
  const amp = g.ctx.createGain();
  amp.gain.setValueAtTime(0, t);
  amp.gain.linearRampToValueAtTime(peak, t + attack);
  amp.gain.setTargetAtTime(0, t + attack, decay / 6);
  osc.connect(amp).connect(dest);
  osc.start(t);
  osc.stop(t + attack + decay + 0.05);
}

function noiseSource(g: Graph, t: number, duration: number): AudioBufferSourceNode {
  const src = g.ctx.createBufferSource();
  src.buffer = g.noise;
  src.loop = true;
  src.start(t, Math.random() * g.noise.duration);
  src.stop(t + duration);
  return src;
}

function filter(g: Graph, type: BiquadFilterType, freq: number, q = 0.7): BiquadFilterNode {
  const f = g.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

/** Smooth rise-and-fall curve (peaking at ~60%) for setValueCurveAtTime. */
function swellCurve(peak: number, points = 64): Float32Array {
  const c = new Float32Array(points);
  for (let i = 0; i < points; i++) c[i] = peak * Math.sin(Math.PI * Math.pow(i / (points - 1), 1.4)) ** 2;
  return c;
}

function bowl() {
  run((g) => {
    const t = g.ctx.currentTime + 0.01;
    const out = voice(g, 0.35);
    const f0 = 220;
    // Inharmonic bowl partials; each is a slightly detuned pair so it beats as it rings.
    const partials = [
      { ratio: 1, peak: 0.22, decay: 2.5, beat: 0.7 },
      { ratio: 2.76, peak: 0.1, decay: 1.8, beat: 1.4 },
      { ratio: 5.4, peak: 0.035, decay: 1.1, beat: 2.3 },
    ];
    for (const p of partials) {
      const f = f0 * p.ratio;
      partial(g, out, f - p.beat / 2, t, p.peak, p.decay, 0.015);
      partial(g, out, f + p.beat / 2, t, p.peak, p.decay, 0.015);
    }
  });
}

function swell() {
  run((g) => {
    const t = g.ctx.currentTime + 0.01;
    const dur = 0.9;
    const out = voice(g, 0.45);

    const air = filter(g, "lowpass", 250, 0.9);
    air.frequency.setValueAtTime(250, t);
    air.frequency.exponentialRampToValueAtTime(1400, t + dur * 0.6);
    air.frequency.exponentialRampToValueAtTime(500, t + dur);
    const airAmp = g.ctx.createGain();
    airAmp.gain.setValueCurveAtTime(swellCurve(0.55), t, dur);
    noiseSource(g, t, dur + 0.02).connect(air).connect(airAmp).connect(out);

    const toneAmp = g.ctx.createGain();
    toneAmp.gain.setValueCurveAtTime(swellCurve(0.35), t, dur);
    toneAmp.connect(out);
    for (const [freq, level] of [
      [98, 1],
      [147, 0.35],
    ]) {
      const osc = g.ctx.createOscillator();
      osc.frequency.setValueAtTime(freq * 0.94, t);
      osc.frequency.exponentialRampToValueAtTime(freq, t + dur * 0.6);
      const lvl = g.ctx.createGain();
      lvl.gain.value = level;
      osc.connect(lvl).connect(toneAmp);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    }
  });
}

function riffleStart() {
  riffleWanted = true;
  if (riffle) return;
  run((g) => {
    if (!riffleWanted || riffle) return;
    const t = g.ctx.currentTime;
    const src = g.ctx.createBufferSource();
    src.buffer = g.riffle;
    src.loop = true;
    src.playbackRate.value = 0.94 + Math.random() * 0.12;
    const gain = g.ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.6, t + 0.06);
    src.connect(filter(g, "bandpass", 2800, 0.6)).connect(filter(g, "lowpass", 6500)).connect(gain).connect(voice(g, 0.1));
    src.start(t, Math.random() * g.riffle.duration);
    riffle = { src, gain };
  });
}

function riffleStop() {
  riffleWanted = false;
  const r = riffle;
  if (!r || !graph) return;
  riffle = null;
  const t = graph.ctx.currentTime;
  const gain = r.gain.gain;
  gain.cancelScheduledValues(t);
  gain.setValueAtTime(gain.value, t);
  gain.linearRampToValueAtTime(0, t + 0.15);
  r.src.stop(t + 0.2);
}

function tick() {
  run((g) => {
    const t = g.ctx.currentTime;
    const amp = g.ctx.createGain();
    amp.gain.setValueAtTime(0, t);
    amp.gain.linearRampToValueAtTime(0.5, t + 0.002);
    amp.gain.setTargetAtTime(0, t + 0.002, 0.007);
    noiseSource(g, t, 0.05)
      .connect(filter(g, "highpass", 1200))
      .connect(filter(g, "bandpass", 3600, 1.1))
      .connect(amp)
      .connect(voice(g, 0.06));
  });
}

function chime() {
  run((g) => {
    const t = g.ctx.currentTime + 0.01;
    const out = voice(g, 0.35);
    // A rising fifth: C6 then G6, each with a faint third harmonic for sparkle.
    for (const [freq, at, decay] of [
      [1046.5, 0, 0.9],
      [1568, 0.09, 1.1],
    ]) {
      partial(g, out, freq, t + at, 0.16, decay, 0.005);
      partial(g, out, freq * 3, t + at, 0.025, decay * 0.5, 0.005);
    }
  });
}

function whiteNoise(ctx: AudioContext, seconds: number): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

/** Short decaying noise clicks at ~21/s with jitter, baked into a seamless loop. */
function riffleLoop(ctx: AudioContext, seconds: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const buf = ctx.createBuffer(1, Math.floor(rate * seconds), rate);
  const data = buf.getChannelData(0);
  const mean = 1 / 21;
  for (let at = Math.random() * mean; at < seconds - mean * 0.7; at += mean * (0.65 + Math.random() * 0.7)) {
    const start = Math.floor(at * rate);
    const len = Math.floor(rate * (0.004 + Math.random() * 0.006));
    const level = 0.35 + Math.random() * 0.65;
    const tau = len / 4;
    for (let i = 0; i < len && start + i < data.length; i++) {
      data[start + i] += (Math.random() * 2 - 1) * level * Math.exp(-i / tau);
    }
  }
  return buf;
}

/** Generated stereo room tail: decaying noise, darker towards the end. */
function impulse(ctx: AudioContext, seconds: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const len = Math.floor(rate * seconds);
  const buf = ctx.createBuffer(2, len, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    let smooth = 0;
    for (let i = 0; i < len; i++) {
      const x = i / len;
      smooth += (Math.random() * 2 - 1 - smooth) * (0.6 - 0.45 * x);
      data[i] = smooth * Math.pow(1 - x, 3);
    }
  }
  return buf;
}

export const sound = { isOn, setOn, subscribe, unlock, bowl, swell, riffleStart, riffleStop, tick, chime };

/** Whether sound is on; re-renders when it changes. */
export function useSoundOn(): boolean {
  return useSyncExternalStore(subscribe, isOn, () => false);
}
