import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { CARD_BACK } from "../data/tarot";
import { useKeys } from "../hooks/useKeys";
import { useToday } from "../hooks/useToday";
import { asset } from "../lib/assets";
import { PHASE_NAMES, moonLongitude, moonPhase, signOfLongitude } from "../lib/ephemeris";
import { renderKeepsake, shareKeepsake } from "../lib/keepsake";
import { sound } from "../lib/sound";
import { SPREADS, interpret, saveDailyCard, savedDailyCard, shuffledDeck, type Drawn, type Spread } from "../lib/tarot";
import { signById } from "../lib/zodiac";
import TarotImage from "../ui/TarotImage";
import styles from "./TarotGate.module.css";

type Stage = "choose" | "shuffle" | "cut" | "pick" | "reveal";

/** How long the deck must be held before letting go counts as a shuffle. */
const MIN_SHUFFLE_MS = 1000;
const FLIP_SECONDS = 0.9;

/**
 * The tarot gate, a small ritual in five steps: choose a spread, hold the deck to shuffle it,
 * cut it into three piles and choose one, pick cards from the fan, then turn each card over.
 * The reading appears card by card and can be kept as an image. Opens as a portal from
 * wherever it was summoned (the tapped constellation, or the centre of the screen).
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
  const [turned, setTurned] = useState(0);
  const [holding, setHolding] = useState(false);
  const [tooQuick, setTooQuick] = useState(false);
  const [keepsake, setKeepsake] = useState<Blob | null>(null);
  const [shareState, setShareState] = useState<"idle" | "busy" | "done">("idle");
  const holdStart = useRef(0);
  const fanSize = useFanSize();
  const closeButton = useRef<HTMLButtonElement>(null);

  const close = () => (location.key !== "default" ? navigate(-1) : navigate(`/?sign=${sign?.id ?? ""}`));
  useKeys({ Escape: close });

  useEffect(() => {
    if (!sign) return;
    document.title = `Tarot gate · ${sign.name} · Astro Tree`;
    closeButton.current?.focus({ preventScroll: true });
    sound.swell();
    return () => sound.riffleStop();
  }, [sign]);

  // Opened from "Draw your card of the day": go straight into that spread.
  useEffect(() => {
    const requested = SPREADS.find((s) => s.id === state?.spread);
    if (requested && sign) begin(requested);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on arrival
  }, []);

  const drawn = picked.map((i) => deck[i]);
  const allTurned = stage === "reveal" && turned >= spread.positions.length;
  const notes = useMemo(
    () => (sign && allTurned ? interpret(sign.id, drawn) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- recompute only when a reading completes
    [sign, allTurned, picked],
  );

  // Render the keepsake as soon as the reading is complete: sharing has to happen right
  // after a tap, so the image must already exist by then.
  useEffect(() => {
    if (!sign || !allTurned) return;
    let cancelled = false;
    setKeepsake(null);
    setShareState("idle");
    renderKeepsake({
      sign,
      date: today,
      moonLine: moonLine(today),
      spreadName: spread.name,
      cards: drawn.map((d, i) => ({ drawn: d, label: spread.positions[i].label })),
    })
      .then((blob) => !cancelled && setKeepsake(blob))
      .catch((error: unknown) => console.warn("Keepsake failed:", error));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per completed reading
  }, [allTurned, picked]);

  if (!sign) return <Navigate to="/" replace />;

  function begin(s: Spread) {
    setSpread(s);
    setPicked([]);
    setTurned(0);
    setTooQuick(false);
    const kept = s.id === "daily" && sign ? savedDailyCard(sign.id, today) : null;
    if (kept) {
      // Already drawn today: lay the same card down again, face up, instead of letting it be redrawn.
      setDeck([kept]);
      setPicked([0]);
      setTurned(1);
      setStage("reveal");
      return;
    }
    setDeck(shuffledDeck());
    setStage("shuffle");
  }

  const startHold = () => {
    if (holding) return;
    holdStart.current = performance.now();
    setHolding(true);
    setTooQuick(false);
    sound.riffleStart();
  };
  const endHold = () => {
    if (!holding) return;
    setHolding(false);
    sound.riffleStop();
    if (performance.now() - holdStart.current < MIN_SHUFFLE_MS) {
      setTooQuick(true);
      return;
    }
    setDeck(shuffledDeck()); // the real shuffle happens on release
    setStage("cut");
  };
  const holdKeys = {
    onKeyDown: (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        startHold();
      }
    },
    onKeyUp: (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        endHold();
      }
    },
  };

  const cut = (pile: number) => {
    // Split into three piles; the chosen pile goes on top, the way a querent cuts a real deck.
    const third = Math.ceil(deck.length / 3);
    const piles = [deck.slice(0, third), deck.slice(third, third * 2), deck.slice(third * 2)];
    setDeck([...piles[pile], ...piles.filter((_, i) => i !== pile).flat()]);
    sound.tick();
    setStage("pick");
  };

  const pick = (i: number) => {
    if (stage !== "pick" || picked.includes(i) || picked.length >= spread.positions.length) return;
    const next = [...picked, i];
    setPicked(next);
    preload(deck[i].card.image);
    if (spread.id === "daily") saveDailyCard(sign.id, today, deck[i]);
    if (next.length === spread.positions.length) setTimeout(() => setStage("reveal"), 700);
  };

  const turn = (slot: number) => {
    if (stage !== "reveal" || slot !== turned) return;
    setTurned(slot + 1);
    setTimeout(() => sound.tick(), (FLIP_SECONDS * 1000) / 2);
  };

  const share = async () => {
    if (!keepsake) return;
    setShareState("busy");
    const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    const result = await shareKeepsake(keepsake, `astro-tree-${sign.id}-${day}.png`, `My ${spread.name} reading for ${sign.name}`);
    setShareState(result === "cancelled" ? "idle" : "done");
  };

  const at = origin ? `${origin.x}px ${origin.y}px` : "50% 50%";
  const remaining = spread.positions.length - picked.length;

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
            <p className={styles.lede}>Hold your question gently, {sign.name}. How many cards should answer it?</p>
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
          <div className={styles.shuffle}>
            <button
              type="button"
              className={styles.stack}
              aria-label="Hold to shuffle the deck"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                startHold();
              }}
              onPointerUp={endHold}
              onPointerCancel={endHold}
              onContextMenu={(e) => e.preventDefault()}
              {...holdKeys}
            >
              {Array.from({ length: 8 }, (_, i) => (
                <motion.img
                  key={i}
                  src={asset(`assets/tarot/${CARD_BACK}`)}
                  alt=""
                  draggable={false}
                  className={styles.back}
                  style={{ y: -i * 1.5 }}
                  animate={
                    holding
                      ? {
                          x: [0, (i % 2 ? 1 : -1) * (36 + i * 5), 0, (i % 2 ? -1 : 1) * 26, 0],
                          rotate: [0, (i % 2 ? 1 : -1) * 7, 0, (i % 2 ? -1 : 1) * 4, 0],
                        }
                      : { x: 0, rotate: 0 }
                  }
                  transition={
                    holding
                      ? { duration: 0.9, delay: i * 0.03, ease: "easeInOut", repeat: Infinity }
                      : { type: "spring", stiffness: 260, damping: 22 }
                  }
                />
              ))}
            </button>
            <p className={styles.status} aria-live="polite">
              {holding
                ? "Think of your question… let go when it feels right."
                : tooQuick
                  ? "A little longer: hold the deck until it feels right."
                  : "Press and hold the deck to shuffle it."}
            </p>
          </div>
        )}

        {stage === "cut" && (
          <motion.div className={styles.cut} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <p className={styles.status}>Cut the deck: choose the pile that calls to you.</p>
            <div className={styles.piles}>
              {[0, 1, 2].map((pile) => (
                <motion.button
                  key={pile}
                  type="button"
                  className={styles.pile}
                  aria-label={`Pile ${pile + 1}`}
                  onClick={() => cut(pile)}
                  initial={{ x: (1 - pile) * 80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 20, delay: pile * 0.06 }}
                  whileHover={{ y: -8 }}
                  whileFocus={{ y: -8 }}
                >
                  {[0, 1, 2].map((layer) => (
                    <img
                      key={layer}
                      src={asset(`assets/tarot/${CARD_BACK}`)}
                      alt=""
                      draggable={false}
                      style={{ transform: `translate(${layer * 2}px, ${-layer * 2}px)` }}
                    />
                  ))}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {(stage === "pick" || stage === "reveal") && (
          <LayoutGroup>
            <section className={styles.table} aria-label="Your spread">
              <div className={styles.slots} data-count={spread.positions.length}>
                {spread.positions.map((pos, slot) => {
                  const fanIndex = picked[slot];
                  const d = fanIndex === undefined ? undefined : deck[fanIndex];
                  const next = stage === "reveal" && slot === turned;
                  return (
                    <div key={pos.label} className={styles.slot}>
                      <div className={styles.slotFrame}>
                        {d && (
                          <motion.button
                            type="button"
                            layoutId={`gate-card-${fanIndex}`}
                            className={styles.slotCard}
                            onClick={() => turn(slot)}
                            disabled={!next}
                            data-next={next || undefined}
                            aria-label={slot < turned ? `${pos.label}: ${d.card.name}` : `Turn over the ${pos.label} card`}
                            animate={next ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                            transition={
                              next
                                ? { scale: { duration: 2, repeat: Infinity, ease: "easeInOut" } }
                                : { type: "spring", stiffness: 160, damping: 22 }
                            }
                          >
                            <FlipCard drawn={d} faceUp={slot < turned} />
                          </motion.button>
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
              {stage === "reveal" && !allTurned && (
                <p className={styles.status} aria-live="polite">
                  Tap the glowing card to turn it over.
                </p>
              )}
            </section>
          </LayoutGroup>
        )}

        {stage === "reveal" && turned > 0 && (
          <section className={styles.reading} aria-live="polite">
            <AnimatePresence initial={false}>
              {drawn.slice(0, turned).map((d, i) => {
                const side = d.reversed ? d.card.reversed : d.card.upright;
                return (
                  <motion.article
                    key={d.card.id}
                    className={styles.entry}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  >
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
                  </motion.article>
                );
              })}
            </AnimatePresence>

            {allTurned && (
              <motion.div
                className={styles.after}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
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
                  <button type="button" className={styles.primary} onClick={share} disabled={!keepsake || shareState === "busy"}>
                    {shareState === "done" ? "Kept ✦" : keepsake ? "Keep this reading" : "Preparing keepsake…"}
                  </button>
                  <button type="button" className={styles.secondary} onClick={() => setStage("choose")}>
                    {spread.id === "daily" ? "Try a deeper spread" : "Draw again"}
                  </button>
                  <button type="button" className={styles.secondary} onClick={close}>
                    Back to the sky
                  </button>
                </div>
              </motion.div>
            )}
          </section>
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
            <img src={asset(`assets/tarot/${CARD_BACK}`)} alt="" draggable={false} />
          </motion.button>
        );
      })}
    </div>
  );
}

/** Lifts slightly and glows as it passes edge-on, then settles face up. */
function FlipCard({ drawn, faceUp }: { drawn: Drawn; faceUp: boolean }) {
  return (
    <motion.div
      className={styles.flip}
      initial={false}
      animate={{
        rotateY: faceUp ? 180 : 0,
        y: faceUp ? [0, -12, 0] : 0,
        scale: faceUp ? [1, 1.06, 1] : 1,
      }}
      transition={{ duration: FLIP_SECONDS, ease: [0.4, 0, 0.2, 1] }}
      data-face-up={faceUp || undefined}
    >
      <img className={styles.face} src={asset(`assets/tarot/${CARD_BACK}`)} alt="" draggable={false} />
      <TarotImage
        className={`${styles.face} ${styles.front}`}
        image={drawn.card.image}
        name={drawn.card.name}
        alt={faceUp ? `${drawn.card.name}${drawn.reversed ? ", reversed" : ""}` : ""}
        style={{ transform: `rotateY(180deg)${drawn.reversed ? " rotate(180deg)" : ""}` }}
      />
    </motion.div>
  );
}

function moonLine(date: Date) {
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  const sign = signById(signOfLongitude(moonLongitude(noon)))!;
  return `Moon in ${sign.name}, ${PHASE_NAMES[moonPhase(noon).phase].toLowerCase()}`;
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
  img.src = asset(`assets/tarot/${image}`);
}
