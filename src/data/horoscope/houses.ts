// What each astrological house is about, in the words the readings are built from.
// Index 0 is the 1st house. Daily readings use the house the Moon is passing through
// (counted from the reader's sign); monthly readings use the Sun's house.

export interface House {
  topic: string;
  /** Noun phrases that finish "the spotlight falls on …". */
  focus: string[];
  /** One-sentence advice for a day when the Moon is in this house. */
  advice: string[];
  /** Paragraphs for a month when the Sun is in this house; one per year in a three-year cycle. */
  month: string[];
  monthFocus: string;
  monthAvoid: string;
  newMoon: string;
  fullMoon: string;
}

export const HOUSES: House[] = [
  {
    topic: "self and new beginnings",
    focus: ["your image and how you show up", "fresh starts and your personal style", "your body, your mood and your first impressions"],
    advice: [
      "Lead with the version of yourself you'd like to meet.",
      "A small change in how you present yourself could open an unexpected door.",
      "Put your own needs at the top of the list today, without apology.",
      "Others notice your energy before your words, so walk in with intention.",
      "This is a good day to begin something just for you.",
      "Trust your first instinct about a person or plan; it is sharper than usual.",
      "Let yourself take up a little more space than you normally would.",
      "If you have been waiting for a sign to start, consider this it.",
    ],
    month: [
      "This is your personal new year. Energy and visibility return, so set goals for the twelve months ahead and refresh anything about your look or approach that feels stale.",
      "All eyes are on you this month, and that's a good thing. Lead with confidence, start the projects that belong to you alone, and let your natural charisma do the heavy lifting.",
      "A fresh chapter opens. Your vitality is high, first impressions land well and people respond to your initiative. Put yourself first without guilt.",
    ],
    monthFocus: "fresh starts and self-care",
    monthAvoid: "second-guessing your instincts",
    newMoon: "set intentions for a personal reinvention.",
    fullMoon: "a personal milestone or realisation comes to light.",
  },
  {
    topic: "money and self-worth",
    focus: ["money, comfort and self-worth", "your finances and what you truly value", "the things you own and the worth you give yourself"],
    advice: [
      "Look over your spending with curiosity rather than guilt.",
      "Something you already own holds more value than you realise.",
      "Your worth is not up for negotiation; price your time accordingly.",
      "Treat yourself to one small comfort that feels genuinely earned.",
      "A practical money move made today pays off quietly later.",
      "Notice where you say yes out of habit and where you say yes out of value.",
      "Resist an impulse buy and see if the craving passes by evening.",
      "Slow, steady effort builds the security you're craving.",
    ],
    month: [
      "Money and self-worth take centre stage. Review your income, ask for the raise or rate you deserve, and invest in things that genuinely support your life.",
      "Your values are being tested in practical ways. Notice what you spend on and why; aligning your money with what matters brings real peace of mind.",
      "A grounded, productive month for finances. Build savings, sell what you no longer need, and remember that your talents are assets too.",
    ],
    monthFocus: "budgets, income and self-worth",
    monthAvoid: "spending to soothe a mood",
    newMoon: "plant seeds for financial growth.",
    fullMoon: "a financial matter reaches completion.",
  },
  {
    topic: "communication and learning",
    focus: ["conversations, messages and quick errands", "your mind, your words and your neighbourhood", "siblings, short trips and new ideas"],
    advice: [
      "Send the message you've been drafting in your head.",
      "A casual chat could hand you exactly the information you need.",
      "Write things down; your ideas are coming quickly and won't wait.",
      "Reach out to a sibling, neighbour or old classmate.",
      "Choose your words carefully, because they will be remembered.",
      "A short trip or change of scenery will reset your thinking.",
      "Listen more than you speak and you will learn something useful.",
      "Curiosity is your compass today, so follow the question that won't let go.",
    ],
    month: [
      "Your calendar fills with conversations, errands and short trips. Write, pitch, study and reach out; your words carry unusual weight this month.",
      "Your mind is buzzing. It's a great month to learn a skill, sign up for a class or reconnect with siblings and neighbours.",
      "Communication is your superpower now. Clear up misunderstandings, send the emails you've been avoiding and say yes to local adventures.",
    ],
    monthFocus: "writing, learning and outreach",
    monthAvoid: "gossip and hasty replies",
    newMoon: "start a new course, project or conversation.",
    fullMoon: "news, contracts or conversations come to a head.",
  },
  {
    topic: "home and family",
    focus: ["home, family and your private world", "your roots and the people you count as home", "the comfort of your nest and the feelings underneath"],
    advice: [
      "Spend time making your space feel softer and more like you.",
      "A call with family could clear something that has lingered too long.",
      "Give yourself permission to stay in and recharge.",
      "Old memories may surface; let them pass through without judgment.",
      "Cooking, tidying or rearranging a room will settle your mind.",
      "Protect your private time like the appointment it is.",
      "Someone at home needs reassurance more than advice.",
      "Your emotional foundations matter more than any outside achievement today.",
    ],
    month: [
      "Home and family call you back to your roots. Nest, redecorate or simply spend more time with the people who feel like home.",
      "Your emotional foundations need attention. Slow down, tend to your private life and let yourself be cared for.",
      "A month for inner work and domestic projects. Old family patterns may surface; meet them with compassion and you'll come out lighter.",
    ],
    monthFocus: "home, family and emotional roots",
    monthAvoid: "overcommitting outside the home",
    newMoon: "begin a home or family project.",
    fullMoon: "family emotions peak; nurture yourself.",
  },
  {
    topic: "romance and creativity",
    focus: ["romance, creativity and play", "pleasure, flirtation and self-expression", "your heart's desires and the things that make you laugh"],
    advice: [
      "Say yes to the plan that sounds fun rather than useful.",
      "Flirt a little, even if it's only with a new idea.",
      "Make something with your hands and don't judge how it turns out.",
      "Romance favours the bold, so make the first move.",
      "Joy is productive today, and play will spark a breakthrough.",
      "Share your talents without waiting to be asked.",
      "A creative risk is worth more than a safe repeat.",
      "Let your inner child pick one activity, and honour the choice.",
    ],
    month: [
      "Romance, creativity and fun are favoured. Flirt, create, play and say yes to whatever makes your heart beat faster.",
      "Your creative spark is bright. Start the passion project, plan a date and let yourself enjoy life without needing a reason.",
      "Joy is the assignment this month. Love life heats up for many, and anything you make with your whole heart is likely to shine.",
    ],
    monthFocus: "romance, play and creative projects",
    monthAvoid: "taking yourself too seriously",
    newMoon: "open your heart to romance or a creative venture.",
    fullMoon: "a romance or creative project culminates.",
  },
  {
    topic: "health and daily work",
    focus: ["your health, habits and daily routine", "work, wellness and the details", "the small rituals that keep your life running"],
    advice: [
      "Tackle the task you have been postponing; momentum is on your side.",
      "Your body is asking for water, movement and an earlier night.",
      "Small improvements to your routine will add up faster than you think.",
      "Help a colleague without keeping score.",
      "Clear your desk and your inbox and your head will follow.",
      "Pay attention to the details others are skipping.",
      "A walk between tasks will do more than another coffee.",
      "Organise one corner of your life and enjoy the relief.",
    ],
    month: [
      "Health, habits and daily work come into focus. Upgrade your routines, book the check-up and clear the backlog.",
      "Practical self-care pays off now. Small daily improvements to sleep, diet and organisation make a noticeable difference by month's end.",
      "Your work ethic is strong. Help where you can, fine-tune your systems and treat your body like the partner it is.",
    ],
    monthFocus: "routines, health and organisation",
    monthAvoid: "perfectionism and burnout",
    newMoon: "commit to a healthier routine.",
    fullMoon: "work or health efforts show results.",
  },
  {
    topic: "partnership",
    focus: ["partnerships and one-on-one connections", "the people who mirror you best", "commitments, contracts and close allies"],
    advice: [
      "Meet someone halfway and see how much easier things become.",
      "A partner, friend or rival is holding up a useful mirror.",
      "Ask for what you need in a relationship plainly and kindly.",
      "Collaboration beats competition today, so pool your strengths.",
      "Someone may surprise you with an offer worth considering.",
      "Listen to the feedback, even the part that stings a little.",
      "Balance giving with receiving; you deserve both.",
      "A one-on-one conversation could redefine an important bond.",
    ],
    month: [
      "Relationships take the spotlight. Partners, close friends and collaborators need your attention, and a meaningful commitment may be on the table.",
      "Other people bring opportunities your way. Compromise comes easier, and a one-on-one bond can deepen significantly.",
      "A month of mirrors. What you notice in others reflects something in you; balanced give-and-take strengthens every alliance.",
    ],
    monthFocus: "partnerships and agreements",
    monthAvoid: "keeping score in relationships",
    newMoon: "set intentions for your relationships.",
    fullMoon: "a relationship reaches a turning point.",
  },
  {
    topic: "intimacy and transformation",
    focus: ["intimacy, trust and shared resources", "deep bonds and what you share with others", "transformation and the things you keep hidden"],
    advice: [
      "Trust is built in small moments; offer one today.",
      "Look honestly at a debt, loan or shared expense.",
      "Let go of something you have been gripping too tightly.",
      "A deep conversation brings two people closer.",
      "Your intuition about hidden motives is accurate, so act on it quietly.",
      "Release an old resentment and feel the weight lift.",
      "Shared resources need clear agreements; spell them out.",
      "Something ending makes room for something truer.",
    ],
    month: [
      "Depth over breadth this month. Intimacy, trust and shared finances need honest attention, and transformation follows.",
      "Something you've been holding onto is ready to be released. Investments, loans or inheritances may also need a closer look.",
      "Your intuition is piercing. Use it to understand what really drives you and the people you love most.",
    ],
    monthFocus: "trust, intimacy and letting go",
    monthAvoid: "power struggles and secrecy",
    newMoon: "begin a deep emotional or financial reset.",
    fullMoon: "release what you share but no longer need.",
  },
  {
    topic: "travel and higher learning",
    focus: ["travel, study and the bigger picture", "your beliefs and your thirst for adventure", "faraway places, teachers and new philosophies"],
    advice: [
      "Plan a trip, even one that only exists on paper for now.",
      "Read, watch or listen to something outside your usual world.",
      "A mentor or teacher has a message meant for you.",
      "Question a belief you've held for too long.",
      "Say yes to the class, course or adventure that excites you.",
      "Big-picture thinking will solve a small-picture problem.",
      "Your optimism is contagious, so share it.",
      "Distance, whether real or imagined, gives you perspective.",
    ],
    month: [
      "Your horizons widen. Travel, study, publishing or spiritual exploration all feel natural, so follow what fascinates you.",
      "Adventure is calling. Book the trip, take the course or simply seek out perspectives very different from your own.",
      "Big-picture thinking pays off. A belief may evolve, a teacher may appear, and your optimism is magnetic.",
    ],
    monthFocus: "travel, study and meaning",
    monthAvoid: "preaching instead of listening",
    newMoon: "plan a journey or new field of study.",
    fullMoon: "a journey, study or belief comes full circle.",
  },
  {
    topic: "career and reputation",
    focus: ["career, ambition and your public image", "your goals and the reputation you're building", "the work you want to be known for"],
    advice: [
      "Put your ambitions on paper and take one concrete step.",
      "Someone in authority is watching your work, so make it count.",
      "Your reputation grows when you finish what you start.",
      "Ask for the responsibility you know you can handle.",
      "Professional visibility is high; speak up in the meeting.",
      "Define success on your own terms before chasing it.",
      "Discipline today buys you freedom later.",
      "Recognition is closer than it looks; keep showing up.",
    ],
    month: [
      "Career and reputation are in the spotlight. Go after the promotion, launch the project and let decision-makers see what you can do.",
      "Your ambitions get a boost. Recognition is possible, especially if you've been working quietly towards a goal for some time.",
      "A month to climb. Set clear professional intentions; authority figures are more receptive than usual.",
    ],
    monthFocus: "career moves and visibility",
    monthAvoid: "neglecting home for work",
    newMoon: "launch a career goal.",
    fullMoon: "career efforts are recognised.",
  },
  {
    topic: "friendship and hopes",
    focus: ["friends, groups and future hopes", "community and the dreams you share", "your networks and your wishes for tomorrow"],
    advice: [
      "Reconnect with a friend you've been meaning to message.",
      "Group efforts bring better results than solo pushing.",
      "Say your wish out loud to someone who can help.",
      "A new community or online circle could feel like home.",
      "Your unique perspective is exactly what the group needs.",
      "Make plans for the future that excite rather than pressure you.",
      "Generosity toward friends comes back multiplied.",
      "Network without an agenda and see what happens.",
    ],
    month: [
      "Friendships and community flourish. Join a group, collaborate on a shared cause and dream bigger about the future.",
      "Your social circle expands. Networking brings opportunities, and an old friend may reappear with good news.",
      "Hopes and wishes are amplified. Share your goals with your people; collective energy gets them moving.",
    ],
    monthFocus: "friends, community and long-term wishes",
    monthAvoid: "people-pleasing in groups",
    newMoon: "set intentions with friends or a community.",
    fullMoon: "a friendship or group goal blossoms.",
  },
  {
    topic: "rest and the inner life",
    focus: ["rest, dreams and quiet reflection", "solitude, intuition and inner healing", "endings, secrets and the space behind the scenes"],
    advice: [
      "Take a slower pace and let your mind wander.",
      "Your dreams tonight may carry a message, so keep a notebook nearby.",
      "Solitude restores you more than socialising would.",
      "Forgive yourself for something you've been carrying.",
      "Meditation, prayer or quiet music will reset your system.",
      "Not everything needs to be shared yet, so keep a plan private.",
      "Rest is not laziness; it is preparation.",
      "Pay attention to coincidences, because they are pointing somewhere.",
    ],
    month: [
      "A quieter, more reflective month. Rest, retreat and spiritual practice prepare you for the fresh start your birthday season brings.",
      "Endings and closure are favoured. Tie up loose ends, forgive what you can and let your dreams guide you.",
      "Your inner world is rich now. Solitude, creative daydreaming and acts of compassion feed your soul.",
    ],
    monthFocus: "rest, closure and spiritual practice",
    monthAvoid: "isolating for too long",
    newMoon: "start a spiritual practice or quiet retreat.",
    fullMoon: "let go of old patterns and rest.",
  },
];

/** Openers for a daily reading; {moon} is the Moon's sign and {focus} a house focus phrase. Keep the count at 7 (see lib/horoscope.ts). */
export const MOON_INTROS = [
  "With the Moon in {moon} today, the spotlight falls on {focus}.",
  "The Moon moves through {moon}, stirring up {focus}.",
  "Today's Moon in {moon} turns your attention to {focus}.",
  "As the Moon crosses {moon}, your instincts lead you toward {focus}.",
  "The Moon in {moon} lights up the part of your chart tied to {focus}.",
  "Under a {moon} Moon, the day bends toward {focus}.",
  "Lunar energy in {moon} brings {focus} to the surface.",
];

/** {topic} is the house topic, e.g. "travel and higher learning". */
export const RETROGRADE_LINES: Record<"mercury" | "venus" | "mars", string> = {
  mercury: "words go astray, so reread before you send anything about {topic}.",
  venus: "an old feeling resurfaces; revisit what you truly value in {topic}.",
  mars: "pushing harder won't help; rethink your approach to {topic}.",
};
