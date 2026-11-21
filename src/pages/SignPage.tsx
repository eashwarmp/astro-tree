import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SkyOutletContext } from "../app/SkyLayout";
import { useKeys } from "../hooks/useKeys";
import { setPanelTab, usePanelTab } from "../hooks/usePanelTab";
import { readingOptions, useProfile } from "../hooks/useProfile";
import { useToday } from "../hooks/useToday";
import { signIndex, stepSign } from "../lib/zodiac";
import SignNav from "../ui/SignNav";
import SignPanel from "../ui/SignPanel";

export default function SignPage() {
  const { sign, select, openGate } = useOutletContext<SkyOutletContext>();
  const navigate = useNavigate();
  const today = useToday();
  const { profile, save } = useProfile();
  const tab = usePanelTab();
  const options = useMemo(() => readingOptions(profile, sign.id), [profile, sign.id]);

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


  return (
    <>
      <SignNav active={sign} onSelect={select} />
      <SignPanel
        sign={sign}
        today={today}
        tab={tab}
        direction={direction.current}
        onTab={setPanelTab}
        onOpenCard={() => navigate(`/card/${sign.id}`)}
        onOpenGate={(spread) => openGate({ spread })}
        isMine={profile?.sign === sign.id}
        // Setting another sign keeps the rest of the profile (name, birthday, rising).
        onToggleMine={() => profile?.sign !== sign.id && save({ ...profile, sign: sign.id })}
        options={options}
      />
    </>
  );
}
