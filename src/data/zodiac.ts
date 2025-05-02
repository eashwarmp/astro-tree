// One entry per sign; keep coords *very* small (≤ 2) so they fit on-screen.
// Add the other 11 signs when you’re ready.
export type Vec3 = [number, number, number];

export const CONSTELLATIONS: Record<string, Vec3[]> = {
  Aries: [
    [0, 0, 0],
    [0.9, 0.3, 0],
    [1.6, 1, 0],
    [2.4, 1.4, 0],
  ],
  Taurus: [
    [0, 0, 0],
    [1, 0.5, 0],
    [1.8, 1.2, 0],
    [2.6, 1.8, 0],
    [1.5, 0, -0.1],
    [2.3, -0.4, 0],
  ],
  Gemini: [
    [0, 0, 0],
    [1, 0.8, 0],
    [2, 1.2, 0],
    [3, 1.5, 0],
    [2, 0, 0],
    [3, -0.3, 0],
  ],
  Cancer: [
    [0, 0, 0],
    [0.8, 0.6, 0],
    [1.6, 1.1, 0],
    [2.5, 0.9, 0],
    [1.6, -0.7, 0],
  ],
  Leo: [
    [0, 0, 0],
    [1, 0.7, 0],
    [2, 1.4, 0],
    [3, 1.9, 0],
    [2.5, 0.2, 0],
    [3.2, -0.4, 0],
  ],
  Virgo: [
    [0, 0, 0],
    [1.2, 0.4, 0],
    [2.1, 0.9, 0],
    [3, 1.4, 0],
    [1.8, -0.6, 0],
  ],
  Libra: [
    [0, 0, 0],
    [1, 0.5, 0],
    [2, 0, 0],
    [3, 0.6, 0],
    [1.5, 1.1, 0],
  ],
  Scorpio: [
    [0, 0, 0],
    [1, 0.4, 0],
    [2, 1, 0],
    [3, 1.5, 0],
    [2.5, 0, -0.1],
    [3.3, -0.5, 0],
  ],
  Sagittarius: [
    [0, 0, 0],
    [0.6, 0.8, 0],
    [-0.7, 1.1, 0],
    [1.1, 1.6, 0],
  ],
  Capricorn: [
    [0, 0, 0],
    [1, 0.6, 0],
    [1.7, 1.3, 0],
    [2.6, 1.6, 0],
    [1.4, -0.5, 0],
  ],
  Aquarius: [
    [0, 0, 0],
    [1, 0.5, 0],
    [2, 1, 0],
    [3, 1.2, 0],
    [2, -0.4, 0],
  ],
  Pisces: [
    [0, 0, 0],
    [0.8, 0.8, 0],
    [1.6, 1.2, 0],
    [2.4, 1.8, 0],
    [1.2, -0.6, 0],
  ],
};

export interface Horoscope {
  name: string;
  dates: string;
  today: string; // daily reading
  cosmicTip: string;
}

export const horoscopes: Horoscope[] = [
  {
    name: "Aries",
    dates: "Mar 21 – Apr 19",
    today:
      "When it gets too much to handle alone, get some help, Aries. No one won any awards for feeling miserable alone. But great things have been achieved with a positive and balanced mindset backed by team work. Look at alternative solutions or creative brainstorming as a way to gain momentum and additional insights into your current scenario. When you cannot do it all, begin at the root - your home. As long as that remains your safe haven, you will find ways to keep springing back a thousand times over.",
    cosmicTip: "Stay in your own track and factor in progress over perfection.",
  },
  {
    name: "Taurus",
    dates: "Apr 20 – May 20",
    today:
      "Move your body to expend that excess energy that surfaces as outbursts of rage or even ill health or bad luck. Taurus, when you choose to keep sweetness in your heart alive, you not only make everyone else’s life feel like a blessing, but you also feel nourished, cared for and looked after in your own life. For you to spike up your health and wellness meter, you need to invest in yourself - not necessarily monetarily but mainly energetically.",
    cosmicTip: "Taking care of yourself is essential right now.",
  },
  {
    name: "Gemini",
    dates: "May 21 – Jun 20",
    today:
      "Detangle yourself from toxic words, cords and people who drain you more than they lift you up, Gemini. You know your persistent cheerleaders, you know who has your back, even if they may fleetingly appear in your life or may be a consistent part of it.",
    cosmicTip: "Find your tribe and celebrate yourself with them.",
  },
  {
    name: "Cancer",
    dates: "Jun 21 – Jul 22",
    today:
      "Instead of trying to power through your situation or day, Cancer, try to accomplish all you can as it flows. All your cravings signify you trying to fill a void that you may not be able to fully understand.",
    cosmicTip: "Release control to sleep well.",
  },
  {
    name: "Leo",
    dates: "Jul 23 – Aug 22",
    today:
      "As far as your relationships are concerned, Leo, you may have been very social and vocal lately and this is a time for you to celebrate and join in with the intention to bask in them.",
    cosmicTip: "Stay strong in your faith.",
  },
  {
    name: "Virgo",
    dates: "Aug 23 – Sep 22",
    today:
      "When you know something, you just know it. This is your time to call a spade a spade and use your voice for what you feel is right. Virgo, you’ve got the gift to see through a situation in ways others cannot perceive.",
    cosmicTip: "Stay optimistic that you will take the right action steps.",
  },
  {
    name: "Libra",
    dates: "Sep 23 – Oct 22",
    today:
      "Detox - emotionally and physically to detox spiritually, Libra. If you find yourself spiralling down a rabbit hole around certain people, excuse yourself for a bit.",
    cosmicTip: "Listen to your inner feelings.",
  },
  {
    name: "Scorpio",
    dates: "Oct 23 – Nov 21",
    today:
      "You don’t need to do anything to minimise yourself, Scorpio. Each one of us is here to fight our own battles and nope, you need not fight someone else’s war in your life.",
    cosmicTip:
      "Consider alternative therapies like sound healing, meditation, crystals and other similar things to get your vibe spruced up.",
  },
  {
    name: "Sagittarius",
    dates: "Nov 22 – Dec 21",
    today:
      "You’ve been asking for divine intervention, and here it is - appearing in your life in miraculous ways. Sag, what will happen if you really get a second opinion or give something another honest shot?",
    cosmicTip:
      "The truth may be a bitter pill, but you may need to let it shine.",
  },
  {
    name: "Capricorn",
    dates: "Dec 22 – Jan 19",
    today:
      "Stop holding yourself back, stop blocking what you wish to say. Capricorn, you were given a powerful voice not because you were to silence it. Instead, find ways to express what you really desire.",
    cosmicTip:
      "Look for the irony in everything, it is there that humour resides.",
  },
  {
    name: "Aquarius",
    dates: "Jan 20 – Feb 18",
    today:
      "Firm up those boundaries, Aquarius! When you feel desolate, ask your angels to come in for assistance and healing. When you feel you cannot back off anymore, ask the cosmos to give you the strength to gently but firmly push back.",
    cosmicTip:
      "Let past hurts slide by you. They don't deserve a seat at your table anymore.",
  },
  {
    name: "Pisces",
    dates: "Feb 19 – Mar 20",
    today:
      "Calm your worries and spend a couple of minutes in quiet meditation or contemplation, Pisces. You are not the sum of your surroundings, your surroundings are the sum of all that is ongoing in your heart.",
    cosmicTip: "Go easy - on yourself and your visions.",
  },
];
