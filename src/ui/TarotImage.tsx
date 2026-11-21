import { useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { asset } from "../lib/assets";
import styles from "./TarotImage.module.css";

interface Props extends Omit<HTMLMotionProps<"img">, "src" | "children"> {
  /** File name in public/assets/tarot. */
  image: string;
  /** Shown on the stand-in if the image can't be loaded. */
  name: string;
}

/**
 * A tarot card image that never shows a broken-image icon: it retries once (a flaky
 * connection or a server mid-deploy), then draws a stand-in card with the card's name.
 */
export default function TarotImage({ image, name, className, alt, ...rest }: Props) {
  const [tries, setTries] = useState<Record<string, number>>({});
  const attempt = tries[image] ?? 0;

  if (attempt >= 2) {
    return (
      <motion.div
        className={`${className ?? ""} ${styles.standIn}`}
        layoutId={rest.layoutId}
        style={rest.style as never}
        role="img"
        aria-label={alt || name}
      >
        <span aria-hidden="true">✦</span>
        <strong>{name}</strong>
      </motion.div>
    );
  }

  return (
    <motion.img
      {...rest}
      className={className}
      alt={alt}
      src={asset(`assets/tarot/${image}`) + (attempt ? `?retry=${attempt}` : "")}
      onError={() => setTries((t) => ({ ...t, [image]: attempt + 1 }))}
      draggable={false}
    />
  );
}
