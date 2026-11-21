import { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useKeys } from "../hooks/useKeys";
import { signById } from "../lib/zodiac";
import styles from "./CardPage.module.css";

export default function CardPage() {
  const { sign: id } = useParams();
  const sign = signById(id);
  const navigate = useNavigate();
  const location = useLocation();
  const closeButton = useRef<HTMLButtonElement>(null);

  // Go back if we came from the sky (keeps history tidy); deep links land on the sign instead.
  const close = () => (location.key !== "default" ? navigate(-1) : navigate(`/?sign=${sign?.id ?? ""}`));
  useKeys({ Escape: close });

  useEffect(() => {
    if (!sign) return;
    document.title = `${sign.tarot.name} · ${sign.name} · Astro Tree`;
    closeButton.current?.focus({ preventScroll: true });
  }, [sign]);

  if (!sign) return <Navigate to="/" replace />;
  const { tarot } = sign;

  return (
    <motion.div
      className={styles.backdrop}
      onClick={(e) => e.target === e.currentTarget && close()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="card-title">
        <button ref={closeButton} type="button" className={styles.close} onClick={close}>
          <span aria-hidden="true">←</span> Back to {sign.name}
        </button>

        <motion.img
          layoutId={`tarot-${sign.id}`}
          className={styles.card}
          src={`/assets/tarot/${tarot.image}`}
          alt={`${tarot.name} tarot card`}
          width={300}
          height={527}
          transition={{ type: "spring", stiffness: 180, damping: 24 }}
        />

        <motion.div
          className={styles.text}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <p className={styles.eyebrow}>
            {sign.glyph} The card of {sign.name}
          </p>
          <h1 id="card-title" className={styles.title}>
            <span className={styles.numeral}>{tarot.numeral}</span> {tarot.name}
          </h1>
          <ul className={styles.keywords} aria-label="Keywords">
            {tarot.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
          <p className={styles.meaning}>{tarot.meaning}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
