import { Suspense, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "@react-spring/web";
import { Environment } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

import ConstellationCanvas from "./components/ConstellationCanvas";
import { horoscopes } from "./data/zodiac";
import IntroScene from "./components/IntroScene";
import NebulaEnvironment from "./components/NebulaEnvironment";
import TarotCard from "./features/tarot/TarotCard";
import MainLayout from "./layouts/MainLayout";
import { ZodiacSign } from "./types/tarot";
import { TAROT_FOR_SIGN } from "./data/tarotMap";


import "./styles/App.css";

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
  const navigate = useNavigate();
  const [introDone, setIntroDone] = useState(false);
  const [idx, setIdx] = useState(getTodayIndex());
  const signInfo = horoscopes[idx];

  const prev = () => setIdx((idx - 1 + horoscopes.length) % horoscopes.length);
  const next = () => setIdx((idx + 1) % horoscopes.length);

  const fade = useSpring({
    key: idx,
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

  return (
    <MainLayout>
      <div className="three-bg">
        {!introDone && <IntroScene onDone={() => setIntroDone(true)} />}
        {introDone && <ConstellationCanvas active={signInfo.name} />}
      </div>

      <button className="nav left" onClick={prev}>
        ◀︎
      </button>
      <button className="nav right" onClick={next}>
        ▶︎
      </button>

      {introDone && (
        <div className="overlay" style={{ opacity: 1 }}>
          <h1>{signInfo.name}</h1>
          <small>{signInfo.dates}</small>
          <p className="today">{signInfo.today}</p>
          <p className="cosmic">{signInfo.cosmicTip}</p>
          <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
            <TarotCard
              src={`/assets/tarot/${TAROT_FOR_SIGN[signInfo.name]}`}
              onClick={() => navigate(`/card/${signInfo.name.toLowerCase()}`)}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
