import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import type { SkyOutletContext } from "../app/SkyLayout";
import { useKeys } from "../hooks/useKeys";
import { stepSign } from "../lib/zodiac";
import SignNav from "../ui/SignNav";
import SignPanel from "../ui/SignPanel";

export default function SignPage() {
  const { sign, select } = useOutletContext<SkyOutletContext>();
  const navigate = useNavigate();
  const openCard = () => navigate(`/card/${sign.id}`);

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
      <SignPanel sign={sign} onOpenCard={openCard} />
    </>
  );
}
