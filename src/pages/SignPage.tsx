import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SkyOutletContext } from "../app/SkyLayout";
import { useKeys } from "../hooks/useKeys";
import { useMySign } from "../hooks/useMySign";
import { useToday } from "../hooks/useToday";
import { session } from "../lib/env";
import { signIndex, stepSign } from "../lib/zodiac";
import SignNav from "../ui/SignNav";
import SignPanel, { type PanelTab } from "../ui/SignPanel";

const TAB_KEY = "astro-tree:tab";

export default function SignPage() {
  const { sign, select, openGate } = useOutletContext<SkyOutletContext>();
  const navigate = useNavigate();
  const today = useToday();
  const [mine, setMine] = useMySign();
  const [tab, setTab] = useState<PanelTab>(() => (session.get(TAB_KEY) as PanelTab | null) ?? "today");

  // Which way the reader moved (shortest way round the zodiac), so the panel text slides along.
  const previous = useRef(sign.id);
  const direction = useRef(1);
  if (previous.current !== sign.id) {
    const delta = (signIndex(sign.id) - signIndex(previous.current) + 12) % 12;
    direction.current = delta <= 6 ? 1 : -1;
    previous.current = sign.id;
  }

  useKeys({
    ArrowLeft: () => select(stepSign(sign.id, -1).id),
    ArrowRight: () => select(stepSign(sign.id, 1).id),
  });

  useEffect(() => {
    document.title = `${sign.name} · Astro Tree`;
  }, [sign]);

  const changeTab = (t: PanelTab) => {
    setTab(t);
    session.set(TAB_KEY, t);
  };

  return (
    <>
      <SignNav active={sign} onSelect={select} />
      <SignPanel
        sign={sign}
        today={today}
        tab={tab}
        direction={direction.current}
        onTab={changeTab}
        onOpenCard={() => navigate(`/card/${sign.id}`)}
        onOpenGate={(spread) => openGate({ spread })}
        isMine={mine === sign.id}
        onToggleMine={() => setMine(mine === sign.id ? null : sign.id)}
      />
    </>
  );
}
