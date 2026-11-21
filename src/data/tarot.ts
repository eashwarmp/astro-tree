import type { Element } from "./horoscope/voices";

// The full 78-card Rider–Waite–Smith deck, matching the images in public/assets/tarot.
// Meanings are concise modern readings of the traditional interpretations. Astrological
// correspondences for the Major Arcana follow the Golden Dawn, except that The Fool, The Hanged
// Man and Judgement use the modern outer-planet rulers (Uranus, Neptune, Pluto) instead of
// the Golden Dawn's elements (Air, Water, Fire).

export type Suit = "wands" | "cups" | "swords" | "pentacles";

export interface CardSide {
  keywords: string[];
  meaning: string;
}

export interface Card {
  id: string;
  name: string;
  arcana: "major" | "minor";
  suit?: Suit;
  /** Major: 0–21. Minor: 1 (Ace) – 14 (King). */
  number: number;
  image: string;
  element: Element;
  /** Zodiac sign or planet the card corresponds to (Major Arcana only). */
  astrology?: string;
  upright: CardSide;
  reversed: CardSide;
}

export const SUITS: Record<Suit, { name: string; element: Element; theme: string }> = {
  wands: { name: "Wands", element: "fire", theme: "passion, ambition and action" },
  cups: { name: "Cups", element: "water", theme: "emotions, love and relationships" },
  swords: { name: "Swords", element: "air", theme: "thoughts, conflict and truth" },
  pentacles: { name: "Pentacles", element: "earth", theme: "money, work and the body" },
};

// [name, image, element, astrology, upright keywords, upright meaning, reversed keywords, reversed meaning]
type MajorRow = [string, string, Element, string, string, string, string, string];

const MAJORS: MajorRow[] = [
  ["The Fool", "00-TheFool.jpg", "air", "Uranus",
    "Beginnings, Spontaneity, Faith", "A leap into the unknown with an open heart. Trust the journey even before you can see the path.",
    "Recklessness, Hesitation, Naivety", "Either you're holding back from a leap you need to take, or rushing in without looking."],
  ["The Magician", "01-TheMagician.jpg", "air", "Mercury",
    "Manifestation, Skill, Willpower", "Everything you need is already on the table. Focus your will and make it real.",
    "Scattered energy, Manipulation, Untapped talent", "Your power is leaking into distractions, or someone isn't being straight with you."],
  ["The High Priestess", "02-TheHighPriestess.jpg", "water", "the Moon",
    "Intuition, Mystery, Inner knowing", "The answer is within. Be still, listen and trust what you sense but can't yet prove.",
    "Secrets, Disconnection, Ignored instincts", "You're tuning out your inner voice, or something is being kept from you."],
  ["The Empress", "03-TheEmpress.jpg", "earth", "Venus",
    "Abundance, Nurture, Creativity", "Growth, pleasure and fertility in every sense. Tend what you love and it will flourish.",
    "Smothering, Creative block, Self-neglect", "You're giving too much or receiving too little. Nurture yourself first."],
  ["The Emperor", "04-TheEmperor.jpg", "fire", "Aries",
    "Authority, Structure, Leadership", "Order brings power. Set boundaries, make the plan and lead with steady confidence.",
    "Rigidity, Control, Domination", "Structure has turned into control. Loosen your grip, or push back against someone else's."],
  ["The Hierophant", "05-TheHierophant.jpg", "earth", "Taurus",
    "Tradition, Teaching, Belonging", "Wisdom comes through proven paths, mentors and shared ritual.",
    "Rebellion, Nonconformity, Questioning", "Old rules no longer fit. It's time to find your own way of believing."],
  ["The Lovers", "06-TheLovers.jpg", "air", "Gemini",
    "Love, Choice, Alignment", "A meaningful union, or a choice made from your deepest values.",
    "Disharmony, Imbalance, Misalignment", "A relationship or decision is out of step with what you truly want."],
  ["The Chariot", "07-TheChariot.jpg", "water", "Cancer",
    "Willpower, Victory, Direction", "Determination carries you forward. Steer opposing forces toward a single goal.",
    "Lack of direction, Opposition, Stalling", "You're pulled in two directions. Pause and choose where you're actually going."],
  ["Strength", "08-Strength.jpg", "fire", "Leo",
    "Courage, Compassion, Inner strength", "Gentle power tames wild energy. Patience and kindness win where force would fail.",
    "Self-doubt, Insecurity, Raw emotion", "Fear or frustration has the upper hand. Reconnect with your quiet confidence."],
  ["The Hermit", "09-TheHermit.jpg", "earth", "Virgo",
    "Solitude, Reflection, Guidance", "Step back from the noise and seek the light within. Answers come in quiet.",
    "Isolation, Loneliness, Withdrawal", "Retreat has become hiding. Reach back out to the world."],
  ["Wheel of Fortune", "10-WheelOfFortune.jpg", "fire", "Jupiter",
    "Cycles, Luck, Turning point", "The wheel turns in your favour. Embrace change and ride the momentum of fate.",
    "Bad luck, Resistance, Setbacks", "A downturn is temporary. Let go of what you can't control."],
  ["Justice", "11-Justice.jpg", "air", "Libra",
    "Fairness, Truth, Cause and effect", "Clarity and balance prevail. Honest choices bring fair results.",
    "Injustice, Dishonesty, Avoidance", "Something is unbalanced or unaccounted for. Own your part and seek the truth."],
  ["The Hanged Man", "12-TheHangedMan.jpg", "water", "Neptune",
    "Surrender, Pause, New perspective", "Stop pushing. A pause and a different viewpoint reveal what struggle hides.",
    "Stalling, Resistance, Indecision", "You're delaying the inevitable. Surrender the outcome and move."],
  ["Death", "13-Death.jpg", "water", "Scorpio",
    "Endings, Transformation, Release", "A chapter closes so something truer can begin. Let it go with grace.",
    "Resisting change, Stagnation, Fear of endings", "Clinging to the past keeps you stuck; the change will come either way."],
  ["Temperance", "14-Temperance.jpg", "fire", "Sagittarius",
    "Balance, Moderation, Patience", "Blend extremes and take the middle path. Harmony comes with time.",
    "Excess, Imbalance, Impatience", "Something is out of proportion. Slow down and rebalance."],
  ["The Devil", "15-TheDevil.jpg", "earth", "Capricorn",
    "Attachment, Temptation, Shadow", "Look at what binds you, whether a habit, a fear or a desire. Awareness is the key to the chains.",
    "Release, Breaking free, Reclaiming power", "You are loosening an unhealthy hold. Keep going."],
  ["The Tower", "16-TheTower.jpg", "fire", "Mars",
    "Upheaval, Revelation, Sudden change", "What was built on false ground falls away, and the shock clears space for truth.",
    "Averted disaster, Fear of change, Delayed collapse", "You're propping up something that needs to fall. Gentle change now saves a crash later."],
  ["The Star", "17-TheStar.jpg", "air", "Aquarius",
    "Hope, Renewal, Inspiration", "Healing and faith return after the storm. Your wishes are within reach.",
    "Discouragement, Lost faith, Disconnection", "Hope feels far away. Small acts of self-care will reconnect you."],
  ["The Moon", "18-TheMoon.jpg", "water", "Pisces",
    "Intuition, Illusion, Dreams", "Things are not as they seem. Trust your instincts through the uncertainty.",
    "Clarity, Released fear, Truth revealed", "Confusion lifts and hidden things come to light."],
  ["The Sun", "19-TheSun.jpg", "fire", "the Sun",
    "Joy, Success, Vitality", "Warmth, success and pure joy. One of the most positive cards in the deck.",
    "Temporary clouds, Overconfidence, Delayed joy", "Joy is still there, just dimmed. Let your inner child out to play."],
  ["Judgement", "20-Judgement.jpg", "fire", "Pluto",
    "Awakening, Reckoning, Calling", "A wake-up call invites you to rise, forgive and answer a higher purpose.",
    "Self-doubt, Harsh judgement, Ignoring the call", "Inner criticism holds you back. Be gentler with your past self."],
  ["The World", "21-TheWorld.jpg", "earth", "Saturn",
    "Completion, Wholeness, Achievement", "A cycle completes beautifully. Celebrate how far you've come.",
    "Incompletion, Shortcuts, Lack of closure", "You're nearly there. Tie up the last loose ends."],
];

// [upright keywords, upright meaning, reversed keywords, reversed meaning], Ace → King.
type MinorRow = [string, string, string, string];

const MINORS: Record<Suit, MinorRow[]> = {
  wands: [
    ["Inspiration, New venture, Spark", "A burst of creative fire. Say yes to the idea that excites you.",
      "Delays, Lack of drive, False start", "The spark is there but not yet lit. Clear what's blocking your motivation."],
    ["Planning, Decisions, Future vision", "The world is in your hands. Plan your next bold move.",
      "Fear of change, Playing safe, Poor planning", "Staying in your comfort zone limits you. Widen your view."],
    ["Expansion, Foresight, Progress", "Your efforts are sailing out into the world. Expect progress from afar.",
      "Obstacles, Delays, Frustration", "Plans hit snags. Adjust your course rather than abandoning it."],
    ["Celebration, Home, Harmony", "A joyful milestone. Celebrate with the people who feel like home.",
      "Transition, Instability, Lack of support", "A celebration is postponed or home feels unsettled. Create your own stability."],
    ["Competition, Conflict, Tension", "Clashing egos and rivalry. Channel the friction into healthy competition.",
      "Avoiding conflict, Resolution, Truce", "Tension eases. Choose collaboration over fighting."],
    ["Victory, Recognition, Confidence", "Public success and well-earned praise. Ride the wave with grace.",
      "Ego, Fall from grace, Lack of recognition", "Applause is slow to come. Keep going for your own reasons."],
    ["Defence, Perseverance, Standing ground", "Hold your position; you have the high ground.",
      "Overwhelm, Giving up, Defensiveness", "You're exhausted from fighting every battle. Choose which ones matter."],
    ["Speed, Movement, Swift news", "Things move fast now. Messages and opportunities arrive quickly.",
      "Delays, Frustration, Waiting", "Momentum stalls. Use the pause to prepare."],
    ["Resilience, Persistence, Last stand", "You're battle-worn but nearly there. One more push.",
      "Exhaustion, Paranoia, Burnout", "You're running on empty. Rest before you break."],
    ["Burden, Responsibility, Hard work", "You're carrying too much. Success is close, but delegate.",
      "Release, Delegation, Letting go", "Put some of the weight down; not everything is yours to carry."],
    ["Enthusiasm, Exploration, Free spirit", "Exciting news or a new adventure stirs your curiosity.",
      "Impatience, Lack of direction, Setbacks", "Big ideas lack follow-through. Ground your enthusiasm."],
    ["Energy, Passion, Adventure", "Charge ahead with passion, but keep an eye on the road.",
      "Haste, Recklessness, Scattered energy", "Rushing creates mistakes. Slow down before you burn out."],
    ["Confidence, Warmth, Determination", "Magnetic, bold and generous. Own your power and your charm.",
      "Jealousy, Insecurity, Demanding", "Self-doubt is dimming your fire. Reclaim your confidence."],
    ["Vision, Leadership, Boldness", "A natural leader with big vision. Inspire others to follow.",
      "Impulsiveness, Arrogance, High expectations", "Leadership slips into domineering. Lead by example."],
  ],
  cups: [
    ["New love, Compassion, Emotional renewal", "Your heart overflows. Open to love, kindness and creativity.",
      "Blocked emotions, Emptiness, Self-love needed", "Your cup feels empty. Fill it yourself first."],
    ["Partnership, Attraction, Mutual respect", "A beautiful connection based on equality and attraction.",
      "Imbalance, Breakup, Miscommunication", "A relationship is out of balance. Talk honestly."],
    ["Friendship, Celebration, Community", "Joy shared with friends. Gather and celebrate.",
      "Overindulgence, Gossip, Isolation", "Social life feels off. Choose quality company."],
    ["Apathy, Contemplation, Missed chances", "Boredom hides an offer you're ignoring. Look again.",
      "New motivation, Awareness, Acceptance", "You're ready to re-engage with life."],
    ["Loss, Grief, Regret", "Mourning what's gone. Remember that two cups still stand.",
      "Acceptance, Moving on, Forgiveness", "Healing begins. You're ready to turn toward what remains."],
    ["Nostalgia, Innocence, Childhood", "Sweet memories or a reunion bring comfort.",
      "Living in the past, Rose-tinted memories, Moving forward", "Stop idealising the past so you can enjoy the present."],
    ["Choices, Fantasy, Illusion", "Many options shimmer. Not all are real, so choose wisely.",
      "Clarity, Decision, Reality check", "The fog clears and the right choice becomes obvious."],
    ["Walking away, Seeking more, Disillusion", "You're leaving what no longer fulfils you to find deeper meaning.",
      "Fear of change, Stagnation, Aimless drifting", "You know you should move on but keep lingering."],
    ["Wishes fulfilled, Contentment, Satisfaction", "The wish card: what you've hoped for is coming true.",
      "Dissatisfaction, Greed, Smugness", "Getting what you wanted isn't enough. Look for deeper fulfilment."],
    ["Harmony, Family, Happiness", "Emotional fulfilment and a loving home. Happily-ever-after energy.",
      "Disconnection, Family conflict, Broken dreams", "Home life needs repair. Reconnect with what really matters."],
    ["Creative opportunity, Intuitive message, Curiosity", "A sweet surprise or a heartfelt message arrives.",
      "Emotional immaturity, Creative block, Insecurity", "Feelings are raw. Give yourself grace."],
    ["Romance, Charm, Following the heart", "A romantic offer or an invitation to follow your heart.",
      "Moodiness, Unrealistic expectations, Jealousy", "Romance is more fantasy than reality. Check the facts."],
    ["Compassion, Calm, Emotional security", "Deeply intuitive and nurturing. Lead with empathy.",
      "Codependence, Martyrdom, Overwhelm", "You're absorbing everyone's feelings. Protect your energy."],
    ["Emotional balance, Diplomacy, Wisdom", "Calm mastery of emotions. Stay steady in rough waters.",
      "Manipulation, Moodiness, Volatility", "Emotions are being suppressed or used as weapons. Find your centre."],
  ],
  swords: [
    ["Clarity, Breakthrough, Truth", "A sharp new insight cuts through confusion.",
      "Confusion, Miscommunication, Clouded judgement", "Your thinking is muddled. Get the facts before deciding."],
    ["Indecision, Stalemate, Avoidance", "You're blindfolded between two choices. Remove the blindfold.",
      "Information overload, Lesser of two evils, Release", "Pressure forces a decision. Trust yourself."],
    ["Heartbreak, Sorrow, Painful truth", "A painful truth or loss. Let yourself feel it so it can heal.",
      "Recovery, Forgiveness, Releasing pain", "The worst is passing; healing has begun."],
    ["Rest, Recovery, Contemplation", "Retreat and recharge before the next battle.",
      "Restlessness, Burnout, Stagnation", "You can't keep going without rest. Take it now."],
    ["Conflict, Winning at all costs, Tension", "A hollow victory. Ask whether this fight is worth it.",
      "Reconciliation, Making amends, Moving on", "Let the argument go and make peace."],
    ["Transition, Moving on, Calmer waters", "You're leaving troubled waters for something better.",
      "Resistance, Unfinished business, Baggage", "You can't move forward while dragging the past along."],
    ["Strategy, Deception, Getting away", "Someone is being sneaky, or you need to be strategic.",
      "Confession, Coming clean, Conscience", "The truth comes out. Honesty is the best move."],
    ["Restriction, Self-limiting beliefs, Feeling trapped", "The bindings are looser than you think. You can walk free.",
      "Release, New perspective, Self-acceptance", "You're freeing yourself from limiting thoughts."],
    ["Anxiety, Worry, Sleepless nights", "Fears loom larger at night than in reality. Talk them through.",
      "Hope, Reaching out, Despair lifting", "The worst of the worry is behind you."],
    ["Painful ending, Rock bottom, Release", "An ending hits hard, but the only way from here is up.",
      "Recovery, Regeneration, Resisting the end", "You're rising from a low point. Don't reopen old wounds."],
    ["Curiosity, Mental energy, New ideas", "Eager to learn and speak up. Ask the questions.",
      "Gossip, All talk, Defensiveness", "Words outpace actions. Think before you speak."],
    ["Ambition, Fast thinking, Drive", "Charging toward a goal with sharp focus.",
      "Impulsiveness, Burnout, Aggression", "Moving too fast hurts people. Slow down."],
    ["Independence, Clear boundaries, Honesty", "Sharp, perceptive and direct. Speak your truth with grace.",
      "Coldness, Bitterness, Harshness", "Protecting yourself has made you cold. Soften a little."],
    ["Intellect, Authority, Truth", "Clear-headed judgement and principled leadership.",
      "Manipulation, Cruelty, Abuse of power", "Logic without heart becomes harsh. Balance both."],
  ],
  pentacles: [
    ["Opportunity, Prosperity, New venture", "A seed of material success: a job, investment or offer appears.",
      "Missed chance, Poor planning, Scarcity", "An opportunity slips by. Prepare better next time."],
    ["Balance, Adaptability, Juggling priorities", "Juggling many things successfully. Stay flexible.",
      "Overwhelm, Disorganisation, Overcommitment", "You're dropping balls. Simplify your load."],
    ["Teamwork, Craft, Collaboration", "Skilled people working together build something lasting.",
      "Disharmony, Poor quality, Working alone", "The team isn't in sync. Realign on the goal."],
    ["Security, Saving, Control", "Holding tight to what you have; stability through caution.",
      "Greed, Materialism, Letting go", "Your grip is too tight. Generosity brings flow."],
    ["Hardship, Insecurity, Isolation", "A lean time. Help is nearby if you look for the light in the window.",
      "Recovery, Improvement, Spiritual wealth", "Hard times are ending. Accept support."],
    ["Generosity, Charity, Sharing", "Give and receive freely; balance in giving brings blessings.",
      "Strings attached, Debt, One-sided giving", "Watch for imbalance in who gives and who takes."],
    ["Patience, Investment, Long-term view", "Your efforts are growing. Be patient for the harvest.",
      "Impatience, Poor returns, Wasted effort", "Results are slow. Reassess where you invest your energy."],
    ["Diligence, Mastery, Skill-building", "Practice makes progress. Commit to your craft.",
      "Perfectionism, Lack of focus, Shortcuts", "Cutting corners or overworking. Find a steady rhythm."],
    ["Abundance, Luxury, Self-sufficiency", "You've earned your comfort. Enjoy the fruits of your labour.",
      "Overwork, Superficiality, Financial setbacks", "Independence feels lonely or costly. Rebalance."],
    ["Wealth, Legacy, Family", "Lasting security and family prosperity.",
      "Financial loss, Family disputes, Instability", "Long-term plans need attention. Protect what matters."],
    ["Ambition, Study, Manifestation", "A new skill, course or opportunity to build something real.",
      "Procrastination, Lack of progress, Missed lessons", "Dreams need action. Take the first practical step."],
    ["Hard work, Routine, Reliability", "Slow and steady wins. Keep showing up.",
      "Laziness, Stagnation, Boredom", "Routine has become a rut. Shake things up."],
    ["Nurturing, Practicality, Abundance", "Grounded care and practical wisdom; home and work in harmony.",
      "Self-neglect, Work-home imbalance, Smothering", "You're caring for everyone but yourself. Take your turn."],
    ["Wealth, Security, Discipline", "Prosperity and solid leadership. You've built something strong.",
      "Greed, Stubbornness, Obsession with status", "Money has become the goal instead of the tool."],
  ],
};

const RANKS = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King"];
const IMAGE_PREFIX: Record<Suit, string> = { wands: "Wands", cups: "Cups", swords: "Swords", pentacles: "Pentacles" };

const side = (keywords: string, meaning: string): CardSide => ({ keywords: keywords.split(", "), meaning });

export const DECK: Card[] = [
  ...MAJORS.map(([name, image, element, astrology, uk, um, rk, rm], number) => ({
    id: `major-${number}`,
    name,
    arcana: "major" as const,
    number,
    image,
    element,
    astrology,
    upright: side(uk, um),
    reversed: side(rk, rm),
  })),
  ...(Object.keys(MINORS) as Suit[]).flatMap((suit) =>
    MINORS[suit].map(([uk, um, rk, rm], i) => ({
      id: `${suit}-${i + 1}`,
      name: `${RANKS[i]} of ${SUITS[suit].name}`,
      arcana: "minor" as const,
      suit,
      number: i + 1,
      image: `${IMAGE_PREFIX[suit]}${String(i + 1).padStart(2, "0")}.jpg`,
      element: SUITS[suit].element,
      upright: side(uk, um),
      reversed: side(rk, rm),
    })),
  ),
];

export const CARD_BACK = "CardBacks.jpg";
