import { motion } from "framer-motion";
import { TarotCardProps } from "../../types/tarot";

export default function TarotCard({ src, onClick }: TarotCardProps) {
  return (
    <motion.img
      className="tarot-thumb"
      src={src}
      onClick={onClick}
      whileHover={{ y: -4, rotateX: -8 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 20 }}
    />
  );
} 