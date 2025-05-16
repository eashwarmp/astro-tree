import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getRandomReading } from "../../utils/tarotReadings";
import styles from "./CardFocus.module.css";
import { TAROT_FOR_SIGN } from "../../data/tarotMap";
import { horoscopes } from "../../data/zodiac";
import { useState, startTransition, useEffect } from "react";

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
  
  // Find the matching horoscope
  const signInfo = horoscopes.find(h => h.name.toLowerCase() === sign?.toLowerCase());
  const reading = signInfo?.today || getRandomReading(sign || "");
  const cardSrc = getCardImageSrc(signInfo?.name);
  
  const [closing, setClosing] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload the image
  useEffect(() => {
    const img = new Image();
    img.src = cardSrc;
    img.onload = () => setImageLoaded(true);
  }, [cardSrc]);

  const handleCardClick = () => {
    setClosing(true);
    setTimeout(() => {
      startTransition(() => navigate('/', { 
        state: { 
          introDone: true,
          selectedSign: signInfo?.name // Pass the correct sign name back
        } 
      }));
    }, 400);
  };

  return (
    <div className={styles.nebulaBg}>
      <div className={styles.container}>
        <AnimatePresence mode="wait">
          {!closing && imageLoaded && (
            <motion.img
              key={sign}
              layoutId={`card-${signInfo?.name}`}
              className={`big-card ${styles.card}`}
              src={cardSrc}
              alt={signInfo?.name ? `${signInfo.name} tarot card` : "Tarot card"}
              onError={e => {
                (e.target as HTMLImageElement).src = "/assets/tarot/fallback.jpg";
              }}
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              exit={{ rotateY: -90 }}
              transition={{ type: "spring", stiffness: 200, damping: 18 }}
              onClick={handleCardClick}
            />
          )}
        </AnimatePresence>
        <motion.p 
          className={styles.reading}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ delay: 0.2 }}
        >
          {reading}
        </motion.p>
      </div>
    </div>
  );
} 