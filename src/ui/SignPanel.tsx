import { motion } from "framer-motion";
import type { Sign } from "../data/signs";
import styles from "./SignPanel.module.css";

interface Props {
  sign: Sign;
  onOpenCard: () => void;
}

/** Today's reading for the active sign: a side panel on landscape screens, a bottom sheet otherwise. */
export default function SignPanel({ sign, onOpenCard }: Props) {
  return (
    <div className={styles.slot}>
      <motion.section
        key={sign.id}
        className={styles.panel}
        aria-labelledby="sign-title"
        aria-live="polite"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <header className={styles.header}>
          <span className={styles.glyph} aria-hidden="true">
            {sign.glyph}
          </span>
          <div>
            <h1 id="sign-title" className={styles.title}>
              {sign.name}
            </h1>
            <p className={styles.dates}>{sign.dates}</p>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.reading}>
            <p className={styles.today}>{sign.today}</p>
            <p className={styles.tip}>{sign.cosmicTip}</p>
          </div>

          <button type="button" className={styles.cardButton} onClick={onOpenCard}>
            <motion.img
              layoutId={`tarot-${sign.id}`}
              className={styles.card}
              src={`/assets/tarot/${sign.tarot.image}`}
              alt=""
              width={300}
              height={527}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            />
            <span className={styles.cardLabel}>
              {sign.tarot.name}
              <small>Open card</small>
            </span>
          </button>
        </div>
      </motion.section>
    </div>
  );
}
