import { Suspense, useEffect, useState } from "react";
import ConstellationCanvas from "./components/ConstellationCanvas";
import { horoscopes } from "./data/zodiac";
import { useSpring, a as aHtml } from "@react-spring/web";
import { Environment } from "@react-three/drei";

import "./App.css";

import IntroScene from "./components/IntroScene";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import NebulaEnvironment from "./components/NebulaEnvironment";

export function getTodayIndex() {
  const m = new Date().getMonth() + 1; // 1‑12
  const d = new Date().getDate();
  /* rough cutoff table */
  const table = [
    [3, 21],
    [4, 20],
    [5, 21],
    [6, 21],
    [7, 23],
    [8, 23],
    [9, 23],
    [10, 23],
    [11, 22],
    [12, 22],
    [1, 20],
    [2, 19],
  ];
  let idx = 0;
  while (
    idx < 12 &&
    (m > table[idx][0] || (m === table[idx][0] && d >= table[idx][1]))
  )
    idx++;
  return idx % 12; // Aries=0 … Pisces=11
}

export default function App() {
  // usePreloadNebula();
  const [introDone, setIntroDone] = useState(false);
  const [idx, setIdx] = useState(getTodayIndex());
  const signInfo = horoscopes[idx];

  const prev = () => setIdx((idx - 1 + horoscopes.length) % horoscopes.length);
  const next = () => setIdx((idx + 1) % horoscopes.length);

  /* 🌟 HUD opacity springs on idx change */
  const fade = useSpring({
    key: idx, // restart animation on every new sign
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { tension: 120, friction: 22 },
  });

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);

  //   <>
  //     {/* 3-D backdrop */}
  //     <div className="three-bg">
  //       <ConstellationCanvas active={signInfo.name} />
  //     </div>

  //     {/* HUD */}
  //     <div className="overlay">
  //       <h1>{signInfo.name}</h1>
  //       <small>{signInfo.dates}</small>

  //       <p className="today">{signInfo.today}</p>
  //       <p className="cosmic">{signInfo.cosmicTip}</p>
  //     </div>

  //     {/* nav arrows */}
  //     <button className="nav left" onClick={prev}>
  //       ◀︎
  //     </button>
  //     <button className="nav right" onClick={next}>
  //       ▶︎
  //     </button>
  //   </>
  // );

  return (
    <>
      <div className="three-bg">
        {!introDone && <IntroScene onDone={() => setIntroDone(true)} />}
        {introDone && <ConstellationCanvas active={signInfo.name} />}
      </div>

      {/* nav arrows (unchanged) */}
      <button className="nav left" onClick={prev}>
        ◀︎
      </button>
      <button className="nav right" onClick={next}>
        ▶︎
      </button>

      {introDone && (
        <aHtml.div style={fade as any} className="overlay">
          {/* ✅ cast */}
          <h1>{signInfo.name}</h1>
          <small>{signInfo.dates}</small>
          <p className="today">{signInfo.today}</p>
          <p className="cosmic">{signInfo.cosmicTip}</p>
        </aHtml.div>
      )}
    </>
  );
}
