// Everything fixed about a sign lives here: name, dates and its tarot card. Daily and monthly
// readings are generated from the sky (see lib/horoscope.ts).

export type SignId =
  | "aries"
  | "taurus"
  | "gemini"
  | "cancer"
  | "leo"
  | "virgo"
  | "libra"
  | "scorpio"
  | "sagittarius"
  | "capricorn"
  | "aquarius"
  | "pisces";

export interface TarotCard {
  name: string;
  numeral: string;
  image: string;
  keywords: string[];
  meaning: string;
}

export interface Sign {
  id: SignId;
  name: string;
  glyph: string;
  dates: string;
  tarot: TarotCard;
}

// "︎" asks for the text glyph rather than the emoji.
export const SIGNS: Sign[] = [
  {
    id: "aries",
    name: "Aries",
    glyph: "♈︎",
    dates: "Mar 21 – Apr 19",
    tarot: {
      name: "The Emperor",
      numeral: "IV",
      image: "04-TheEmperor.jpg",
      keywords: ["Authority", "Structure", "Leadership"],
      meaning:
        "The Emperor builds order out of raw drive. He asks you to set the rules for your own life and hold to them, leading by steady example rather than force.",
    },
  },
  {
    id: "taurus",
    name: "Taurus",
    glyph: "♉︎",
    dates: "Apr 20 – May 20",
    tarot: {
      name: "The Hierophant",
      numeral: "V",
      image: "05-TheHierophant.jpg",
      keywords: ["Tradition", "Teaching", "Belonging"],
      meaning:
        "The Hierophant keeps what has been proven to work. Lean on a trusted teacher, ritual or community, and let familiar foundations steady you.",
    },
  },
  {
    id: "gemini",
    name: "Gemini",
    glyph: "♊︎",
    dates: "May 21 – Jun 20",
    tarot: {
      name: "The Lovers",
      numeral: "VI",
      image: "06-TheLovers.jpg",
      keywords: ["Choice", "Union", "Alignment"],
      meaning:
        "The Lovers is about choosing with your whole heart. A decision is in front of you; pick the path that matches your values, not just your wants.",
    },
  },
  {
    id: "cancer",
    name: "Cancer",
    glyph: "♋︎",
    dates: "Jun 21 – Jul 22",
    tarot: {
      name: "The Chariot",
      numeral: "VII",
      image: "07-TheChariot.jpg",
      keywords: ["Willpower", "Direction", "Momentum"],
      meaning:
        "The Chariot moves forward by holding opposing forces in balance. Protect what you care about, then steer it with focus and resolve.",
    },
  },
  {
    id: "leo",
    name: "Leo",
    glyph: "♌︎",
    dates: "Jul 23 – Aug 22",
    tarot: {
      name: "Strength",
      numeral: "VIII",
      image: "08-Strength.jpg",
      keywords: ["Courage", "Patience", "Compassion"],
      meaning:
        "Strength tames the lion with a gentle hand. Real power is quiet confidence: meet what is wild in you and others with patience instead of force.",
    },
  },
  {
    id: "virgo",
    name: "Virgo",
    glyph: "♍︎",
    dates: "Aug 23 – Sep 22",
    tarot: {
      name: "The Hermit",
      numeral: "IX",
      image: "09-TheHermit.jpg",
      keywords: ["Reflection", "Solitude", "Inner guidance"],
      meaning:
        "The Hermit steps away from the noise to find the answer by lantern light. Take quiet time; the clarity you need is already within you.",
    },
  },
  {
    id: "libra",
    name: "Libra",
    glyph: "♎︎",
    dates: "Sep 23 – Oct 22",
    tarot: {
      name: "Justice",
      numeral: "XI",
      image: "11-Justice.jpg",
      keywords: ["Fairness", "Truth", "Cause and effect"],
      meaning:
        "Justice weighs every side honestly. Be clear-eyed about what is fair, own your part, and trust that balanced choices bring balanced outcomes.",
    },
  },
  {
    id: "scorpio",
    name: "Scorpio",
    glyph: "♏︎",
    dates: "Oct 23 – Nov 21",
    tarot: {
      name: "Death",
      numeral: "XIII",
      image: "13-Death.jpg",
      keywords: ["Endings", "Transformation", "Release"],
      meaning:
        "Death is the end of a chapter, not of you. Let what has run its course fall away so something truer has room to begin.",
    },
  },
  {
    id: "sagittarius",
    name: "Sagittarius",
    glyph: "♐︎",
    dates: "Nov 22 – Dec 21",
    tarot: {
      name: "Temperance",
      numeral: "XIV",
      image: "14-Temperance.jpg",
      keywords: ["Balance", "Moderation", "Patience"],
      meaning:
        "Temperance pours between two cups without spilling a drop. Blend extremes, take the middle way, and let things come together in their own time.",
    },
  },
  {
    id: "capricorn",
    name: "Capricorn",
    glyph: "♑︎",
    dates: "Dec 22 – Jan 19",
    tarot: {
      name: "The Devil",
      numeral: "XV",
      image: "15-TheDevil.jpg",
      keywords: ["Attachment", "Temptation", "Awareness"],
      meaning:
        "The Devil shows the chains we could slip off if we noticed them. Name the habit or fear that has a hold on you; seeing it clearly loosens its grip.",
    },
  },
  {
    id: "aquarius",
    name: "Aquarius",
    glyph: "♒︎",
    dates: "Jan 20 – Feb 18",
    tarot: {
      name: "The Star",
      numeral: "XVII",
      image: "17-TheStar.jpg",
      keywords: ["Hope", "Renewal", "Inspiration"],
      meaning:
        "The Star arrives after the storm. Healing is underway; keep faith in the future and pour your gifts back into the world.",
    },
  },
  {
    id: "pisces",
    name: "Pisces",
    glyph: "♓︎",
    dates: "Feb 19 – Mar 20",
    tarot: {
      name: "The Moon",
      numeral: "XVIII",
      image: "18-TheMoon.jpg",
      keywords: ["Intuition", "Dreams", "Uncertainty"],
      meaning:
        "The Moon lights the path only partway. Not everything is as it seems; trust your intuition to carry you through what you can't yet see.",
    },
  },
];
