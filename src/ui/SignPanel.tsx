import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SIGNS, type Sign } from "../data/signs";
import type { PanelTab } from "../hooks/usePanelTab";
import { dailyHoroscope, monthlyHoroscope, type ReadingOptions } from "../lib/horoscope";
import { dailyHistory, savedDailyCard } from "../lib/tarot";
import styles from "./SignPanel.module.css";
import TarotImage from "./TarotImage";

const TABS: { id: PanelTab; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "month", label: "This month" },
  { id: "tarot", label: "Tarot" },
];

interface Props {
  sign: Sign;
  today: Date;
  tab: PanelTab;
  /** -1 or 1: which way the reader is moving through the zodiac, so text slides with them. */
  direction: number;
  onTab: (tab: PanelTab) => void;
  onOpenCard: () => void;
  /** Opens the tarot gate; with "daily", straight into the card of the day. */
  onOpenGate: (spread?: "daily") => void;
  isMine: boolean;
  onToggleMine: () => void;
  /** Personalisation for the reader's own sign (rising, birthday). */
  options: ReadingOptions;
}

/**
 * The reading for the active sign. The panel itself never remounts or changes size when the
 * sign changes; only its contents slide, which keeps quick left/right browsing smooth.
 */
export default function SignPanel(props: Props) {
  const { sign, today, tab, direction, onTab, onOpenCard, onOpenGate, isMine, onToggleMine, options } = props;
  const dailyCard = savedDailyCard(sign.id, today);
  const history = tab === "tarot" ? dailyHistory(sign.id, today, 30) : [];
  const daily = useMemo(() => dailyHoroscope(sign.id, today, options), [sign.id, today, options]);
  const monthly = useMemo(
    () => (tab === "month" ? monthlyHoroscope(sign.id, today.getFullYear(), today.getMonth() + 1, options) : null),
    [sign.id, today, tab, options],
  );
  const rising = options.housesFrom && SIGNS.find((s) => s.id === options.housesFrom);

  // Browsing signs stays snappy; switching tabs gets a slightly slower, softer fade.
  const slide = {
    initial: { opacity: 0, x: 24 * direction },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -24 * direction },
    transition: { duration: 0.18, ease: "easeOut" },
  } as const;
  const fade = { ...slide, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } } as const;

  return (
    <div className={styles.slot}>
      <section className={styles.panel} aria-labelledby="sign-title">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.header key={sign.id} className={styles.header} {...slide}>
            <span className={styles.glyph} aria-hidden="true">
              {sign.glyph}
            </span>
            <div className={styles.heading}>
              <h1 id="sign-title" className={styles.title}>
                {sign.name}
              </h1>
              <p className={styles.dates}>
                {sign.dates}
                <button
                  type="button"
                  className={styles.mine}
                  aria-pressed={isMine}
                  onClick={onToggleMine}
                  title={isMine ? "This is your sign; the sky opens here" : "Open the sky on this sign every time"}
                >
                  <span aria-hidden="true">{isMine ? "★" : "☆"}</span> {isMine ? "My sign" : "Make my sign"}
                </button>
              </p>
            </div>
          </motion.header>
        </AnimatePresence>

        <div className={styles.tabs} role="tablist" aria-label="Reading">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={tab === t.id}
              aria-controls="panel-body"
              className={styles.tab}
              onClick={() => onTab(t.id)}
            >
              {t.label}
              {tab === t.id && <motion.span layoutId="tab-underline" className={styles.underline} />}
            </button>
          ))}
        </div>

        <div id="panel-body" className={styles.body} role="tabpanel" aria-labelledby={`tab-${tab}`} aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div key={`${sign.id}-${tab}`} className={styles.content} {...(tab === "today" ? slide : fade)}>
              {tab === "today" && (
                <>
                  <p className={styles.meta}>
                    <span>{today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</span>
                    <span className={styles.moon}>
                      <MoonIcon illumination={daily.moon.illumination} waxing={daily.moon.phase.startsWith("wax") || daily.moon.phase === "first-quarter"} />
                      Moon in {daily.moon.signName}, {daily.moon.phaseName.toLowerCase()}
                    </span>
                  </p>
                  {daily.headline && (
                    <p className={styles.headline}>
                      <span aria-hidden="true">✦ </span>
                      {daily.headline}
                    </p>
                  )}
                  <p className={styles.reading}>{daily.reading}</p>
                  {rising && <p className={styles.footnote}>Houses counted from your {rising.name} rising.</p>}
                  <div className={styles.tip}>
                    <span className={styles.label}>Tip of the day</span>
                    <p>{daily.tip}</p>
                  </div>
                  <button type="button" className={styles.dailyCard} onClick={() => onOpenGate("daily")}>
                    <span aria-hidden="true">✦</span>
                    {dailyCard
                      ? `Your card today: ${dailyCard.card.name}${dailyCard.reversed ? " (reversed)" : ""}`
                      : "Draw your card of the day"}
                  </button>
                  <ul className={styles.lucky} aria-label="Lucky charms">
                    <li title={daily.lucky.numberNote}>
                      <span>Number</span>
                      {daily.lucky.number}
                      <small>{daily.lucky.numberNote}</small>
                    </li>
                    <li title={daily.lucky.colorNote}>
                      <span>Colour</span>
                      {daily.lucky.color}
                      <small>{daily.lucky.colorNote}</small>
                    </li>
                    <li title={daily.lucky.hoursNote}>
                      <span>Your hours</span>
                      {daily.lucky.hours}
                      <small>{daily.lucky.hoursNote}</small>
                    </li>
                  </ul>
                </>
              )}

              {tab === "month" && monthly && (
                <>
                  <p className={styles.meta}>{today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                  <p className={styles.reading}>{monthly.overview}</p>
                  <dl className={styles.focus}>
                    <div>
                      <dt>Focus on</dt>
                      <dd>{monthly.focus}</dd>
                    </div>
                    <div>
                      <dt>Avoid</dt>
                      <dd>{monthly.avoid}</dd>
                    </div>
                  </dl>
                  {monthly.events.length > 0 && (
                    <>
                      <span className={styles.label}>In the sky this month</span>
                      <ul className={styles.events}>
                        {monthly.events.map((e) => {
                          const status = eventStatus(e.date, e.end, today);
                          return (
                            <li key={e.date + e.kind} data-status={status}>
                              <span aria-hidden="true">{e.kind === "new" ? "●" : e.kind === "full" ? "○" : "℞"}</span>
                              <span>
                                {status !== "upcoming" && <em className={styles.status}>{STATUS_LABEL[status]}</em>}
                                {e.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </>
              )}

              {tab === "tarot" && (
                <>
                  <div className={styles.ownCard}>
                    <button type="button" className={styles.cardButton} onClick={onOpenCard} aria-label={`Open ${sign.tarot.name}`}>
                      <TarotImage
                        layoutId={`tarot-${sign.id}`}
                        className={styles.card}
                        image={sign.tarot.image}
                        name={sign.tarot.name}
                        alt=""
                        width={300}
                        height={527}
                        transition={{ type: "spring", stiffness: 180, damping: 24 }}
                      />
                    </button>
                    <div>
                      <span className={styles.label}>{sign.name}'s card</span>
                      <p className={styles.cardName}>
                        {sign.tarot.numeral} · {sign.tarot.name}
                      </p>
                      <p className={styles.keywords}>{sign.tarot.keywords.join(" · ")}</p>
                      <button type="button" className={styles.link} onClick={onOpenCard}>
                        Read its meaning
                      </button>
                    </div>
                  </div>
                  <button type="button" className={styles.gate} onClick={() => onOpenGate()}>
                    <span aria-hidden="true">✦</span> Enter the tarot gate
                  </button>
                  {history.length > 0 && (
                    <div>
                      <span className={styles.label}>Your recent cards of the day</span>
                      <ol className={styles.history}>
                        {history.map(({ date, drawn }) => (
                          <li key={date.toDateString()} title={`${drawn.card.name}${drawn.reversed ? " (reversed)" : ""}`}>
                            <TarotImage
                              image={drawn.card.image}
                              name={drawn.card.name}
                              alt={`${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}: ${drawn.card.name}${drawn.reversed ? ", reversed" : ""}`}
                              className={drawn.reversed ? styles.flipped : undefined}
                            />
                            <span>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  <p className={styles.hint}>
                    Draw from the full 78-card deck: one card for today, or three for a deeper spread. You can also tap
                    the glowing constellation.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

type EventStatus = "past" | "now" | "upcoming";
const STATUS_LABEL: Record<EventStatus, string> = { past: "Passed", now: "Now", upcoming: "" };

function eventStatus(start: string, end: string | undefined, today: Date): EventStatus {
  const day = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  if ((end ?? start) < day) return "past";
  return start <= day ? "now" : "upcoming";
}

/** A tiny moon drawn at the current phase. */
function MoonIcon({ illumination, waxing }: { illumination: number; waxing: boolean }) {
  // The terminator is an ellipse whose half-width shrinks to 0 at quarter moon.
  const rx = Math.abs(1 - 2 * illumination) * 6;
  const lit = illumination > 0.5;
  const side = waxing ? 1 : 0;
  const d = `M7 1 A6 6 0 0 ${side} 7 13 A${rx} 6 0 0 ${lit ? side : 1 - side} 7 1`;
  return (
    <svg className={styles.moonIcon} viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      <circle cx="7" cy="7" r="6" fill="rgba(255,255,255,0.15)" />
      <path d={d} fill="#f4efff" />
    </svg>
  );
}
