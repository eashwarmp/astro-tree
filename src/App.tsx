import {  useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSpring } from "@react-spring/web";


import ConstellationCanvas from "./components/ConstellationCanvas";
import { horoscopes } from "./data/zodiac";
import IntroScene from "./components/IntroScene";
import NebulaEnvironment from "./components/NebulaEnvironment";
import TarotCard from "./features/tarot/TarotCard";
import MainLayout from "./layouts/MainLayout";
import { TAROT_FOR_SIGN } from "./data/tarotMap";
import ZodiacScene from "./components/ZodiacScene";
import { Canvas } from "@react-three/fiber";

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
  const location = useLocation();
  const [introDone, setIntroDone] = useState(location.state?.introDone || false);
  const [idx, setIdx] = useState(getTodayIndex());
  const signInfo = horoscopes[idx];
  const isCardView = location.pathname.startsWith('/card/');
  const cardSign = isCardView ? location.pathname.split('/').pop()?.toUpperCase() : null;

  const prev = () => setIdx((idx - 1 + horoscopes.length) % horoscopes.length);
  const next = () => setIdx((idx + 1) % horoscopes.length);



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
        {introDone && !isCardView && <ConstellationCanvas active={signInfo.name} />}
        {introDone && isCardView && (
          <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
            <NebulaEnvironment />
            <ZodiacScene 
              active={cardSign || signInfo.name}
              skipIntro={true}
            />
          </Canvas>
        )}
      </div>

      {!isCardView && (
        <>
          <button className="nav left" onClick={prev}>
            ◀︎
          </button>
          <button className="nav right" onClick={next}>
            ▶︎
          </button>
        </>
      )}

      {introDone && !isCardView && (
        <div className="overlay" style={{ opacity: 1 }}>
          <h1>{signInfo.name}</h1>
          <small>{signInfo.dates}</small>
          <p className="today">{signInfo.today}</p>
          <p className="cosmic">{signInfo.cosmicTip}</p>
          <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
            <TarotCard
              src={`/assets/tarot/${TAROT_FOR_SIGN[signInfo.name]}`}
              sign={signInfo.name.toLowerCase()}
              onClick={() => navigate(`/card/${signInfo.name.toLowerCase()}`)}
            />
          </div>
        </div>
      )}
    </MainLayout>
  );
}
