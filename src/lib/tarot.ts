import { VOICES } from "../data/horoscope/voices";
import { SIGNS, type SignId } from "../data/signs";
import { DECK, SUITS, type Card, type Suit } from "../data/tarot";
import { local } from "./env";

export interface Spread {
  id: "daily" | "timeline" | "guidance";
  name: string;
  description: string;
  positions: { label: string; frame: string }[];
}

export const SPREADS: Spread[] = [
  {
    id: "daily",
    name: "Card of the day",
    description: "One card for today's energy.",
    positions: [{ label: "Today", frame: "The energy around you today" }],
  },
  {
    id: "timeline",
    name: "Past · Present · Future",
    description: "Three cards for where you've been and where you're going.",
    positions: [
      { label: "Past", frame: "What brought you here" },
      { label: "Present", frame: "Where you stand now" },
      { label: "Future", frame: "Where this is heading" },
    ],
  },
  {
    id: "guidance",
    name: "Situation · Obstacle · Advice",
    description: "Three cards for a question on your mind.",
    positions: [
      { label: "Situation", frame: "The heart of the matter" },
      { label: "Obstacle", frame: "What stands in your way" },
      { label: "Advice", frame: "How to move forward" },
    ],
  },
];

export interface Drawn {
  card: Card;
  reversed: boolean;
}

/** Roughly a third of cards come up reversed, as with a well-shuffled, mixed-orientation deck. */
const REVERSED_CHANCE = 0.35;

export function shuffledDeck(random: () => number = secureRandom): Drawn[] {
  const deck = DECK.map((card) => ({ card, reversed: random() < REVERSED_CHANCE }));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/** Reading-wide observations that tie the drawn cards to the reader's sign. */
export function interpret(signId: SignId, drawn: Drawn[]): string[] {
  const sign = SIGNS.find((s) => s.id === signId)!;
  const element = VOICES[signId].element;
  const notes: string[] = [];

  const own = drawn.find((d) => d.card.image === sign.tarot.image);
  if (own) notes.push(`${own.card.name} is ${sign.name}'s own card. Its appearance is a strong personal message.`);

  const majors = drawn.filter((d) => d.card.arcana === "major").length;
  if (drawn.length > 1) {
    if (majors === drawn.length) notes.push("Every card is Major Arcana: fate and big life lessons are at work.");
    else if (majors * 2 > drawn.length) notes.push("The Major Arcana dominate, pointing to significant life themes rather than passing events.");
    else if (majors === 0) notes.push("All Minor Arcana: this is about everyday choices that are in your hands.");
  } else if (majors === 1) {
    notes.push("A Major Arcana card for the day: today carries more weight than it seems.");
  }

  const suits = new Map<Suit, number>();
  for (const d of drawn) if (d.card.suit) suits.set(d.card.suit, (suits.get(d.card.suit) ?? 0) + 1);
  const [topSuit, count] = [...suits.entries()].sort((a, b) => b[1] - a[1])[0] ?? [];
  if (topSuit && count! >= 2) notes.push(`${SUITS[topSuit].name} lead the spread, so the focus is ${SUITS[topSuit].theme}.`);

  const kindred = drawn.filter((d) => d.card.element === element);
  if (kindred.length) {
    const names = kindred.map((d) => d.card.name).join(" and ");
    notes.push(`As a ${element} sign, you'll feel ${names} especially strongly.`);
  } else if (drawn.length > 1) {
    const suit = Object.values(SUITS).find((s) => s.element === element)!.name;
    notes.push(`No ${suit} answered you, ${sign.name}. This message comes from outside your ${element} nature, so let it in.`);
  }

  const reversed = drawn.filter((d) => d.reversed).length;
  if (drawn.length > 1 && reversed === drawn.length) notes.push("Every card is reversed: energy is turned inward or blocked, so be patient with yourself.");
  else if (drawn.length > 1 && reversed === 0) notes.push("All cards upright: the energy is flowing freely.");

  return notes;
}

// The card of the day is drawn once: reopening the gate shows the same card until tomorrow.
const dailyKey = (signId: SignId, date: Date) =>
  `astro-tree:daily-card:${signId}:${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export function savedDailyCard(signId: SignId, date: Date): Drawn | null {
  const [id, orientation] = (local.get(dailyKey(signId, date)) ?? "").split(":");
  const card = DECK.find((c) => c.id === id);
  return card ? { card, reversed: orientation === "r" } : null;
}

export function saveDailyCard(signId: SignId, date: Date, drawn: Drawn) {
  local.set(dailyKey(signId, date), `${drawn.card.id}:${drawn.reversed ? "r" : "u"}`);
}

function secureRandom() {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] / 2 ** 32;
}
