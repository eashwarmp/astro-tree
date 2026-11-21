import { describe, expect, it } from "vitest";
import { SIGNS } from "../data/signs";
import { CARD_BACK, DECK } from "../data/tarot";
import { interpret, shuffledDeck } from "./tarot";

// Vite resolves the glob at transform time, so this lists the card art actually on disk.
const onDisk = new Set(
  Object.keys(import.meta.glob("../../public/assets/tarot/*.jpg")).map((path) => path.split("/").pop()),
);

describe("deck", () => {
  it("has all 78 cards, each with art on disk", () => {
    expect(DECK).toHaveLength(78);
    expect(new Set(DECK.map((c) => c.id)).size).toBe(78);
    for (const card of [...DECK.map((c) => c.image), CARD_BACK]) expect(onDisk.has(card), card).toBe(true);
  });

  it("gives every card upright and reversed meanings", () => {
    for (const card of DECK) {
      expect(card.upright.keywords.length).toBeGreaterThanOrEqual(3);
      expect(card.reversed.keywords.length).toBeGreaterThanOrEqual(3);
      expect(card.upright.meaning).not.toBe(card.reversed.meaning);
    }
  });

  it("includes each sign's own card", () => {
    for (const s of SIGNS) expect(DECK.some((c) => c.image === s.tarot.image)).toBe(true);
  });
});

describe("shuffledDeck", () => {
  it("is a permutation of the deck", () => {
    const ids = shuffledDeck().map((d) => d.card.id);
    expect(new Set(ids).size).toBe(78);
  });
});

describe("interpret", () => {
  const card = (id: string) => DECK.find((c) => c.id === id)!;

  it("notices the reader's own card and their element", () => {
    const notes = interpret("scorpio", [
      { card: card("major-13"), reversed: false },
      { card: card("cups-2"), reversed: false },
      { card: card("cups-9"), reversed: true },
    ]);
    expect(notes.join(" ")).toContain("Death is Scorpio's own card");
    expect(notes.join(" ")).toContain("Cups lead the spread");
    expect(notes.join(" ")).toContain("water sign");
  });
});
