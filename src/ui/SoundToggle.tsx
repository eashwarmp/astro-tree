import { sound, useSoundOn } from "../lib/sound";
import styles from "./SoundToggle.module.css";

interface Props {
  className?: string;
}

/** Round moon button that turns the optional ambient sounds on and off. */
export default function SoundToggle({ className }: Props) {
  const on = useSoundOn();

  const toggle = () => {
    const next = !sound.isOn();
    sound.setOn(next);
    if (next) {
      sound.unlock();
      sound.chime();
    }
  };

  return (
    <button
      type="button"
      className={className ? `${styles.toggle} ${className}` : styles.toggle}
      onClick={toggle}
      aria-pressed={on}
      aria-label="Sound"
      title={on ? "Sound on" : "Sound off"}
    >
      <span className={styles.moon} aria-hidden="true">
        {"☾︎"}
      </span>
    </button>
  );
}
