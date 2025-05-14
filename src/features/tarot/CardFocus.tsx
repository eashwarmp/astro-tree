import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getRandomReading } from "../../utils/tarotReadings";
import styles from "./CardFocus.module.css";
import { TAROT_FOR_SIGN } from "../../data/tarotMap";

const capitalize = (s?: string) => s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
const getCardImageSrc = (sign?: string) => {
  const capSign = capitalize(sign);
  return capSign && TAROT_FOR_SIGN[capSign]
    ? `/assets/tarot/${TAROT_FOR_SIGN[capSign]}`
    : "/assets/tarot/fallback.jpg";
};

export default function CardFocus() {
  const { sign } = useParams();
  const navigate = useNavigate();
  const reading = getRandomReading(sign || "");
  const cardSrc = getCardImageSrc(sign);

  return (
    <div className={styles.nebulaBg}>
      <div className={styles.container}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          ← Back
        </button>
        <motion.img
          className={styles.card}
          src={cardSrc}
          alt={sign ? `${sign} tarot card` : "Tarot card"}
          onError={e => {
            (e.target as HTMLImageElement).src = "/assets/tarot/fallback.jpg";
          }}
          initial={{ rotateY: 90 }}
          animate={{ rotateY: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
        />
        <p className={styles.reading}>{reading}</p>
      </div>
    </div>
  );
} 