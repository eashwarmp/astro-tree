import { useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { LayoutGroup, motion } from "framer-motion";
import { CARD_BACK } from "../data/tarot";
import { useKeys } from "../hooks/useKeys";
import { useToday } from "../hooks/useToday";
import { SPREADS, interpret, saveDailyCard, savedDailyCard, shuffledDeck, type Drawn, type Spread } from "../lib/tarot";
import { signById } from "../lib/zodiac";
import styles from "./TarotGate.module.css";

type Stage = "choose" | "shuffle" | "pick" | "reveal";

const SHUFFLE_MS = 1700;
const FLIP_GAP_MS = 650;

/**
 * The tarot gate: choose a spread, watch the deck shuffle, pick cards from a fan, then flip
 * them one by one into a reading tailored to the sign. Opens as a portal from wherever it was
 * summoned (the tapped constellation, or the centre of the screen).
 */
export default function TarotGate() {
  const { sign: id } = useParams();
  const sign = signById(id);
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { origin?: { x: number; y: number }; spread?: Spread["id"] } | null;
  const origin = state?.origin;
  const today = useToday();

  const [stage, setStage] = useState<Stage>("choose");
  const [spread, setSpread] = useState<Spread>(SPREADS[0]);
  const [deck, setDeck] = useState<Drawn[]>([]);
  const [picked, setPicked] = useState<number[]>([]);
  const [flipped, setFlipped] = useState(0);
  const fanSize = useFanSize();
  const closeButton = useRef<HTMLButtonElement>(null);

  const close = () => (location.key !== "default" ? navigate(-1) : navigate(`/?sign=${sign?.id ?? ""}`));
  useKeys({ Escape: close });

  useEffect(() => {
    if (!sign) return;
    document.title = `Tarot gate · ${sign.name} · Astro Tree`;
    closeButton.current?.focus({ preventScroll: true });
  }, [sign]);

  useEffect(() => {
    if (stage === "shuffle") {
      const t = setTimeout(() => setStage("pick"), SHUFFLE_MS);
      return () => clearTimeout(t);
    }
    if (stage === "reveal" && flipped < spread.positions.length) {
      const t = setTimeout(() => setFlipped((f) => f + 1), flipped === 0 ? 500 : FLIP_GAP_MS);
      return () => clearTimeout(t);
    }
  }, [stage, flipped, spread]);

  // Opened from "Draw your card of the day": go straight into that spread.
  useEffect(() => {
    const requested = SPREADS.find((s) => s.id === state?.spread);
    if (requested && sign) begin(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on arrival
  }, []);

  const drawn = picked.map((i) => deck[i]);
  const notes = useMemo(
    () => (sign && stage === "reveal" ? interpret(sign.id, drawn) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute only when a reading is revealed
    [sign, stage, picked],
  );

  if (!sign) return <Navigate to="/" replace />;

  const begin = (s: Spread) => {
    setSpread(s);
    setPicked([]);
    setFlipped(0);
    const kept = s.id === "daily" ? savedDailyCard(sign.id, today) : null;
    if (kept) {
      // Already drawn today: lay the same card down again instead of letting it be redrawn.
      setDeck([kept]);
      setPicked([0]);
      preload(kept.card.image);
      setStage("reveal");
      return;
    }
    setDeck(shuffledDeck());
    setStage("shuffle");
  };

  const pick = (i: number) => {
    if (stage !== "pick" || picked.includes(i) || picked.length >= spread.positions.length) return;
    const next = [...picked, i];
    setPicked(next);
    preload(deck[i].card.image);
    if (spread.id === "daily") saveDailyCard(sign.id, today, deck[i]);
    if (next.length === spread.positions.length) setTimeout(() => setStage("reveal"), 700);
  };

  const at = origin ? `${origin.x}px ${origin.y}px` : "50% 50%";
  const remaining = spread.positions.length - picked.length;
  const allFlipped = stage === "reveal" && flipped >= spread.positions.length;

  return (
    <motion.div
      className={styles.gate}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gate-title"
      initial={{ clipPath: `circle(0% at ${at})` }}
      animate={{ clipPath: `circle(150% at ${at})` }}
      transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
    >
      <div className={styles.inner}>
        <header className={styles.top}>
          <button ref={closeButton} type="button" className={styles.close} onClick={close}>
            <span aria-hidden="true">←</span> Back to {sign.name}
          </button>
          <h1 id="gate-title" className={styles.title}>
            <span aria-hidden="true">✦</span> The Tarot Gate
          </h1>
        </header>

        {stage === "choose" && (
          <motion.section
            className={styles.choose}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className={styles.lede}>
              Hold your question gently, {sign.name}. How many cards should answer it?
            </p>
            <div className={styles.spreads}>
              {SPREADS.map((s) => (
                <button key={s.id} type="button" className={styles.spread} onClick={() => begin(s)}>
                  <span className={styles.spreadIcon} aria-hidden="true">
                    {s.positions.map((p) => (
                      <i key={p.label} />
                    ))}
                  </span>
                  <strong>{s.name}</strong>
                  <span>{s.description}</span>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        {stage === "shuffle" && (
          <div className={styles.shuffle} aria-live="polite">
            <div className={styles.stack}>
              {Array.from({ length: 8 }, (_, i) => (
                <motion.img
                  key={i}
                  src={`/assets/tarot/${CARD_BACK}`}
                  alt=""
                  className={styles.back}
                  initial={{ x: 0, rotate: 0 }}
                  animate={{
                    x: [0, (i % 2 ? 1 : -1) * (40 + i * 6), 0, (i % 2 ? -1 : 1) * 30, 0],
                    rotate: [0, (i % 2 ? 1 : -1) * 8, 0, (i % 2 ? -1 : 1) * 5, 0],
                    y: [0, -i * 1.5, 0, -i * 1.5, -i * 1.5],
                  }}
                  transition={{ duration: SHUFFLE_MS / 1000 - 0.2, delay: i * 0.03, ease: "easeInOut" }}
                />
              ))}
            </div>
            <p className={styles.status}>The deck is listening…</p>
          </div>
        )}

        {(stage === "pick" || stage === "reveal") && (
          <LayoutGroup>
            <section className={styles.table} aria-label="Your spread">
              <div className={styles.slots} data-count={spread.positions.length}>
                {spread.positions.map((pos, slot) => {
                  const fanIndex = picked[slot];
                  const d = fanIndex === undefined ? undefined : deck[fanIndex];
                  return (
                    <div key={pos.label} className={styles.slot}>
                      <div className={styles.slotFrame}>
                        {d && (
                          <motion.div layoutId={`gate-card-${fanIndex}`} className={styles.slotCard} transition={{ type: "spring", stiffness: 160, damping: 22 }}>
                            <FlipCard drawn={d} faceUp={stage === "reveal" && flipped > slot} />
                          </motion.div>
                        )}
                      </div>
                      <span className={styles.slotLabel}>{pos.label}</span>
                    </div>
                  );
                })}
              </div>

              {stage === "pick" && (
                <>
                  <p className={styles.status} aria-live="polite">
                    {remaining > 0
                      ? `Choose ${remaining === spread.positions.length ? "" : "another "}${remaining === 1 ? "a card" : `${remaining} cards`} from the fan`
                      : "The cards are chosen…"}
                  </p>
                  <Fan count={fanSize} picked={picked} onPick={pick} />
                </>
              )}
            </section>
          </LayoutGroup>
        )}

        {allFlipped && (
          <motion.section
            className={styles.reading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            aria-live="polite"
          >
            {drawn.map((d, i) => {
              const side = d.reversed ? d.card.reversed : d.card.upright;
              return (
                <article key={d.card.id} className={styles.entry}>
                  <span className={styles.position}>
                    {spread.positions[i].label} · {spread.positions[i].frame}
                  </span>
                  <h2 className={styles.cardName}>
                    {d.card.name}
                    {d.reversed && <span className={styles.reversed}> reversed</span>}
                  </h2>
                  <ul className={styles.chips}>
                    {side.keywords.map((k) => (
                      <li key={k}>{k}</li>
                    ))}
                    {d.card.astrology && <li className={styles.astro}>{d.card.astrology}</li>}
                  </ul>
                  <p>{side.meaning}</p>
                </article>
              );
            })}
            {notes.length > 0 && (
              <div className={styles.notes}>
                <span className={styles.position}>What the spread says for {sign.name}</span>
                <ul>
                  {notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              </div>
            )}
            {spread.id === "daily" && (
              <p className={styles.status}>This is your card for today. A new one waits for you tomorrow.</p>
            )}
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={() => setStage("choose")}>
                {spread.id === "daily" ? "Try a deeper spread" : "Draw again"}
              </button>
              <button type="button" className={styles.secondary} onClick={close}>
                Back to the sky
              </button>
            </div>
          </motion.section>
        )}
      </div>
    </motion.div>
  );
}

/** Face-down cards laid out on an arc; picked ones fly to their slot via a shared layoutId. */
function Fan({ count, picked, onPick }: { count: number; picked: number[]; onPick: (i: number) => void }) {
  const spread = Math.min(110, count * 6);
  return (
    <div className={styles.fan} style={{ ["--count" as string]: count }}>
      {Array.from({ length: count }, (_, i) => {
        if (picked.includes(i)) return null;
        const t = count === 1 ? 0 : i / (count - 1) - 0.5;
        const angle = t * spread;
        const rad = (angle * Math.PI) / 180;
        return (
          <motion.button
            key={i}
            type="button"
            layoutId={`gate-card-${i}`}
            className={styles.fanCard}
            aria-label={`Card ${i + 1}`}
            onClick={() => onPick(i)}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.025, type: "spring", stiffness: 200, damping: 22 }}
            style={{
              // Positions are in units of the card height so the arc scales with the screen.
              left: `calc(50% + ${Math.sin(rad)} * var(--fan-radius))`,
              top: `calc(${1 - Math.cos(rad)} * var(--fan-radius))`,
              rotate: angle,
            }}
            whileHover={{ y: -14 }}
            whileFocus={{ y: -14 }}
          >
            <img src={`/assets/tarot/${CARD_BACK}`} alt="" draggable={false} />
          </motion.button>
        );
      })}
    </div>
  );
}

function FlipCard({ drawn, faceUp }: { drawn: Drawn; faceUp: boolean }) {
  return (
    <motion.div
      className={styles.flip}
      initial={false}
      animate={{ rotateY: faceUp ? 180 : 0 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      <img className={styles.face} src={`/assets/tarot/${CARD_BACK}`} alt="" draggable={false} />
      <img
        className={`${styles.face} ${styles.front}`}
        src={`/assets/tarot/${drawn.card.image}`}
        alt={faceUp ? `${drawn.card.name}${drawn.reversed ? ", reversed" : ""}` : ""}
        style={{ transform: `rotateY(180deg)${drawn.reversed ? " rotate(180deg)" : ""}` }}
        draggable={false}
      />
    </motion.div>
  );
}

function useFanSize() {
  const pick = () => (window.innerWidth < 480 ? 11 : window.innerWidth < 900 ? 17 : 22);
  const [n, setN] = useState(pick);
  useEffect(() => {
    const onResize = () => setN(pick());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return n;
}

function preload(image: string) {
  const img = new Image();
  img.src = `/assets/tarot/${image}`;
}
