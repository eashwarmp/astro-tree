// Everything the UI knows about a sign lives here: dates, today's reading and its tarot card.

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
  /** First day of the sign as [month (1–12), day]. */
  starts: [number, number];
  today: string;
  cosmicTip: string;
  tarot: TarotCard;
}

// "︎" asks for the text glyph rather than the emoji.
export const SIGNS: Sign[] = [
  {
    id: "aries",
    name: "Aries",
    glyph: "♈︎",
    dates: "Mar 21 – Apr 19",
    starts: [3, 21],
    today:
      "When it gets too much to handle alone, get some help, Aries. No one won any awards for feeling miserable alone. But great things have been achieved with a positive and balanced mindset backed by team work. Look at alternative solutions or creative brainstorming as a way to gain momentum and additional insights into your current scenario. When you cannot do it all, begin at the root - your home. As long as that remains your safe haven, you will find ways to keep springing back a thousand times over.",
    cosmicTip: "Stay in your own track and factor in progress over perfection.",
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
    starts: [4, 20],
    today:
      "Move your body to expend that excess energy that surfaces as outbursts of rage or even ill health or bad luck. Taurus, when you choose to keep sweetness in your heart alive, you not only make everyone else’s life feel like a blessing, but you also feel nourished, cared for and looked after in your own life. For you to spike up your health and wellness meter, you need to invest in yourself - not necessarily monetarily but mainly energetically.",
    cosmicTip: "Taking care of yourself is essential right now.",
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
    starts: [5, 21],
    today:
      "Detangle yourself from toxic words, cords and people who drain you more than they lift you up, Gemini. You know your persistent cheerleaders, you know who has your back, even if they may fleetingly appear in your life or may be a consistent part of it.",
    cosmicTip: "Find your tribe and celebrate yourself with them.",
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
    starts: [6, 21],
    today:
      "Instead of trying to power through your situation or day, Cancer, try to accomplish all you can as it flows. All your cravings signify you trying to fill a void that you may not be able to fully understand.",
    cosmicTip: "Release control to sleep well.",
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
    starts: [7, 23],
    today:
      "As far as your relationships are concerned, Leo, you may have been very social and vocal lately and this is a time for you to celebrate and join in with the intention to bask in them.",
    cosmicTip: "Stay strong in your faith.",
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
    starts: [8, 23],
    today:
      "When you know something, you just know it. This is your time to call a spade a spade and use your voice for what you feel is right. Virgo, you’ve got the gift to see through a situation in ways others cannot perceive.",
    cosmicTip: "Stay optimistic that you will take the right action steps.",
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
    starts: [9, 23],
    today:
      "Detox - emotionally and physically to detox spiritually, Libra. If you find yourself spiralling down a rabbit hole around certain people, excuse yourself for a bit.",
    cosmicTip: "Listen to your inner feelings.",
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
    starts: [10, 23],
    today:
      "You don’t need to do anything to minimise yourself, Scorpio. Each one of us is here to fight our own battles and nope, you need not fight someone else’s war in your life.",
    cosmicTip:
      "Consider alternative therapies like sound healing, meditation, crystals and other similar things to get your vibe spruced up.",
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
    starts: [11, 22],
    today:
      "You’ve been asking for divine intervention, and here it is - appearing in your life in miraculous ways. Sag, what will happen if you really get a second opinion or give something another honest shot?",
    cosmicTip: "The truth may be a bitter pill, but you may need to let it shine.",
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
    starts: [12, 22],
    today:
      "Stop holding yourself back, stop blocking what you wish to say. Capricorn, you were given a powerful voice not because you were to silence it. Instead, find ways to express what you really desire.",
    cosmicTip: "Look for the irony in everything, it is there that humour resides.",
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
    starts: [1, 20],
    today:
      "Firm up those boundaries, Aquarius! When you feel desolate, ask your angels to come in for assistance and healing. When you feel you cannot back off anymore, ask the cosmos to give you the strength to gently but firmly push back.",
    cosmicTip: "Let past hurts slide by you. They don't deserve a seat at your table anymore.",
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
    starts: [2, 19],
    today:
      "Calm your worries and spend a couple of minutes in quiet meditation or contemplation, Pisces. You are not the sum of your surroundings, your surroundings are the sum of all that is ongoing in your heart.",
    cosmicTip: "Go easy - on yourself and your visions.",
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
