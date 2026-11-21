import { AnimatePresence, motion } from "framer-motion";
import { SIGNS, type Sign, type SignId } from "../data/signs";
import type { IntroPhase } from "../hooks/useIntro";
import type { Profile } from "../hooks/useProfile";
import styles from "./IntroHint.module.css";

interface Props {
  phase: IntroPhase;
  today: Sign;
  profile: Profile | null;
  moonSign: SignId;
  onSkip: () => void;
}

export default function IntroHint({ phase, today, profile, moonSign, onSkip }: Props) {
  const mine = profile && SIGNS.find((s) => s.id === profile.sign)!;
  const moon = SIGNS.find((s) => s.id === moonSign)!;
  const greeting = profile?.name ? `Welcome back, ${profile.name}. ` : "";
  const message =
    phase === "wheel"
      ? `${greeting}Today the Sun is in ${today.name}`
      : phase === "dust"
        ? mine
          ? `…and tonight the Moon is in ${moon.name} for you, ${mine.name}. Brush the stardust aside.`
          : "Brush the stardust aside to reveal the sky"
        : null;

  return (
    <div className={styles.hint}>
      <AnimatePresence mode="wait">
        {message && (
          <motion.p
            key={message}
            className={styles.message}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
      <button type="button" className={styles.skip} onClick={onSkip}>
        Straight to the stars
      </button>
    </div>
  );
}
