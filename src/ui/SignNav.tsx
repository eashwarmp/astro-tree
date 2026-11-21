import { SIGNS, type Sign, type SignId } from "../data/signs";
import { stepSign } from "../lib/zodiac";
import styles from "./SignNav.module.css";

interface Props {
  active: Sign;
  onSelect: (id: SignId) => void;
}

/** Previous / next arrows around a strip of all twelve glyphs. */
export default function SignNav({ active, onSelect }: Props) {
  const prev = stepSign(active.id, -1);
  const next = stepSign(active.id, 1);

  return (
    <nav className={styles.nav} aria-label="Zodiac signs">
      <button type="button" className={styles.arrow} onClick={() => onSelect(prev.id)} aria-label={`Previous: ${prev.name}`}>
        <Chevron flip />
      </button>
      <ul className={styles.strip}>
        {SIGNS.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={styles.glyph}
              onClick={() => onSelect(s.id)}
              aria-label={s.name}
              aria-current={s.id === active.id ? "true" : undefined}
              title={s.name}
            >
              {s.glyph}
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.current} aria-hidden="true">
        {active.name}
      </p>
      <button type="button" className={styles.arrow} onClick={() => onSelect(next.id)} aria-label={`Next: ${next.name}`}>
        <Chevron />
      </button>
    </nav>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
