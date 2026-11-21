import { AnimatePresence, motion } from "framer-motion";
import type { Sign } from "../data/signs";
import type { IntroPhase } from "../hooks/useIntro";
import styles from "./IntroHint.module.css";

interface Props {
  phase: IntroPhase;
  today: Sign;
  onSkip: () => void;
}

export default function IntroHint({ phase, today, onSkip }: Props) {
  const message =
    phase === "wheel"
      ? `Today the Sun is in ${today.name}`
      : phase === "dust"
        ? "Brush the stardust aside to reveal the sky"
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
        Skip intro
      </button>
    </div>
  );
}
