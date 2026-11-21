import type { IntroPhase } from "../../hooks/useIntro";
import DustField from "./DustField";
import ZodiacWheel from "./ZodiacWheel";

interface Props {
  phase: Exclude<IntroPhase, "done">;
  todayIndex: number;
  onReady: () => void;
  onCleared: () => void;
}

export default function IntroSequence({ phase, todayIndex, onReady, onCleared }: Props) {
  return (
    <>
      <ZodiacWheel landOn={todayIndex} visible={phase === "wheel"} onReady={onReady} />
      {phase !== "wheel" && <DustField leaving={phase === "leaving"} onCleared={onCleared} />}
    </>
  );
}
