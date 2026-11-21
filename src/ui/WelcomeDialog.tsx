import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { SIGNS, type SignId } from "../data/signs";
import type { Profile } from "../hooks/useProfile";
import { sound } from "../lib/sound";
import { sunSign } from "../lib/zodiac";
import styles from "./WelcomeDialog.module.css";

const MONTHS = Array.from({ length: 12 }, (_, i) => new Date(2000, i, 1).toLocaleDateString("en-US", { month: "long" }));
const daysIn = (month: number) => new Date(2000, month, 0).getDate(); // 2000 is a leap year, so Feb 29 is allowed

interface Props {
  initial: Profile | null;
  onSave: (profile: Profile) => void;
  onClose: () => void;
}

/** "Which sky were you born under?" Asked once; everything stays on this device. */
export default function WelcomeDialog({ initial, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [month, setMonth] = useState(initial?.birthday?.month ?? 0);
  const [day, setDay] = useState(initial?.birthday?.day ?? 0);
  const [sign, setSign] = useState<SignId | "">(initial?.sign ?? "");
  const [rising, setRising] = useState<SignId | "">(initial?.rising ?? "");
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => first.current?.focus({ preventScroll: true }), []);

  // A birthday decides the sign (the year barely matters except on a cusp, so it stays editable).
  const pickBirthday = (m: number, d: number) => {
    setMonth(m);
    setDay(d);
    if (m && d) setSign(sunSign(new Date(2000, m - 1, Math.min(d, daysIn(m)), 12)).id);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!sign) return;
    onSave({
      sign,
      name: name.trim() || undefined,
      birthday: month && day ? { month, day: Math.min(day, daysIn(month)) } : undefined,
      rising: rising || undefined,
    });
    sound.chime();
  };

  return (
    <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.form
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onSubmit={submit}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 id="welcome-title" className={styles.title}>
          Which sky were you born under?
        </h2>
        <p className={styles.lede}>Tell me once and the stars will open on your sign. It stays on this device.</p>

        <label className={styles.field}>
          <span>Your name (optional)</span>
          <input ref={first} value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" maxLength={40} />
        </label>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Birthday</span>
            <select value={month} onChange={(e) => pickBirthday(Number(e.target.value), day)}>
              <option value={0}>Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span className={styles.hidden}>Day</span>
            <select value={day} onChange={(e) => pickBirthday(month, Number(e.target.value))} aria-label="Birthday day">
              <option value={0}>Day</option>
              {Array.from({ length: month ? daysIn(month) : 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className={styles.row}>
          <label className={styles.field}>
            <span>Sun sign</span>
            <select value={sign} onChange={(e) => setSign(e.target.value as SignId)} required>
              <option value="">Choose…</option>
              {SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.glyph} {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>Rising (optional)</span>
            <select value={rising} onChange={(e) => setRising(e.target.value as SignId)}>
              <option value="">I'm not sure</option>
              {SIGNS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.glyph} {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        {rising && <p className={styles.note}>Your readings will count houses from your {SIGNS.find((s) => s.id === rising)!.name} rising.</p>}

        <div className={styles.actions}>
          <button type="submit" className={styles.primary} disabled={!sign}>
            {initial ? "Save" : "Show me my sky"}
          </button>
          <button type="button" className={styles.secondary} onClick={onClose}>
            {initial ? "Cancel" : "Not now"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}
