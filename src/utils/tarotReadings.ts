const readings: Record<string, string[]> = {
  aries: [
    "Your fiery spirit will lead you to new beginnings. Trust your instincts and charge forward.",
    "A bold decision awaits you. Your natural leadership will guide you through challenges."
  ],
  taurus: [
    "Your steady determination will bring material rewards. Stay grounded in your values.",
    "A period of growth and stability is coming. Your patience will be rewarded."
  ],
  gemini: [
    "Your curiosity will lead to exciting discoveries. Embrace new connections.",
    "Communication is your strength. Share your ideas and watch them flourish."
  ],
  cancer: [
    "Your intuition is strong. Trust your emotional wisdom in upcoming decisions.",
    "Nurturing relationships will bring deep fulfillment. Open your heart."
  ],
  leo: [
    "Your creative energy is at its peak. Shine your light and inspire others.",
    "Leadership opportunities await. Your natural charisma will guide you."
  ],
  virgo: [
    "Your attention to detail will solve a complex problem. Trust your analytical mind.",
    "A period of organization and improvement is coming. Your precision will pay off."
  ],
  libra: [
    "Balance and harmony are within reach. Trust your sense of justice.",
    "New partnerships will bring growth. Your diplomatic nature will serve you well."
  ],
  scorpio: [
    "Your transformative power is strong. Embrace deep changes coming your way.",
    "Intense emotions will lead to breakthroughs. Trust your inner strength."
  ],
  sagittarius: [
    "Adventure calls! Your optimism will lead to exciting new horizons.",
    "Philosophical insights will guide your path. Stay true to your beliefs."
  ],
  capricorn: [
    "Your ambition will bring success. Stay focused on your long-term goals.",
    "Hard work will be rewarded. Your discipline is your greatest asset."
  ],
  aquarius: [
    "Innovation is your path forward. Trust your unique perspective.",
    "Community connections will bring unexpected opportunities. Stay open."
  ],
  pisces: [
    "Your intuition is heightened. Trust your dreams and creative visions.",
    "Spiritual growth awaits. Your compassion will guide you to deeper understanding."
  ]
};

export function getRandomReading(sign: string): string {
  const signReadings = readings[sign.toLowerCase()];
  if (!signReadings) {
    return "The cards suggest a time of reflection and growth. Trust your inner wisdom.";
  }
  return signReadings[Math.floor(Math.random() * signReadings.length)];
} 