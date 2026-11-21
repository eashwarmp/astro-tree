import type { SignId } from "./signs";

// Real star positions (J2000, rounded) for the stick figure of each zodiac constellation.
// ra is in hours, dec in degrees, mag is apparent magnitude (smaller = brighter).

export interface CatalogStar {
  name: string;
  ra: number;
  dec: number;
  mag: number;
}

export interface ConstellationFigure {
  stars: CatalogStar[];
  /** Pairs of indexes into `stars` that are joined by a line. */
  edges: [number, number][];
}

const s = (name: string, ra: number, dec: number, mag: number): CatalogStar => ({ name, ra, dec, mag });

export const CONSTELLATIONS: Record<SignId, ConstellationFigure> = {
  aries: {
    stars: [
      s("Hamal", 2.119, 23.46, 2.0),
      s("Sheratan", 1.911, 20.81, 2.6),
      s("Mesarthim", 1.892, 19.29, 3.9),
      s("41 Arietis", 2.833, 27.26, 3.6),
    ],
    edges: [[3, 0], [0, 1], [1, 2]],
  },
  taurus: {
    stars: [
      s("Aldebaran", 4.599, 16.51, 0.9),
      s("Elnath", 5.438, 28.61, 1.7),
      s("Tianguan", 5.627, 21.14, 3.0),
      s("Ain", 4.477, 19.18, 3.5),
      s("Hyadum I", 4.33, 15.63, 3.6),
      s("Hyadum II", 4.382, 17.54, 3.8),
      s("Lambda Tauri", 4.011, 12.49, 3.4),
      s("Xi Tauri", 3.453, 9.73, 3.7),
      s("Omicron Tauri", 3.413, 9.03, 3.6),
      s("Alcyone", 3.791, 24.11, 2.9),
    ],
    edges: [[1, 3], [3, 5], [5, 4], [4, 0], [0, 2], [4, 6], [6, 7], [7, 8]],
  },
  gemini: {
    stars: [
      s("Castor", 7.577, 31.89, 1.6),
      s("Pollux", 7.755, 28.03, 1.1),
      s("Alhena", 6.629, 16.4, 1.9),
      s("Mebsuta", 6.732, 25.13, 3.0),
      s("Wasat", 7.335, 21.98, 3.5),
      s("Tejat", 6.383, 22.51, 2.9),
      s("Propus", 6.248, 22.51, 3.3),
      s("Mekbuda", 7.068, 20.57, 3.8),
      s("Tau Geminorum", 7.186, 30.25, 4.4),
      s("Iota Geminorum", 7.429, 27.8, 3.8),
      s("Lambda Geminorum", 7.302, 16.54, 3.6),
      s("Alzirr", 6.755, 12.9, 3.4),
    ],
    edges: [[0, 8], [8, 3], [3, 5], [5, 6], [8, 9], [9, 1], [1, 4], [4, 7], [7, 2], [4, 10], [10, 11]],
  },
  cancer: {
    stars: [
      s("Acubens", 8.975, 11.86, 4.3),
      s("Asellus Australis", 8.745, 18.15, 3.9),
      s("Asellus Borealis", 8.721, 21.47, 4.7),
      s("Tarf", 8.275, 9.19, 3.5),
      s("Iota Cancri", 8.778, 28.76, 4.0),
    ],
    edges: [[4, 2], [2, 1], [1, 0], [1, 3]],
  },
  leo: {
    stars: [
      s("Regulus", 10.139, 11.97, 1.4),
      s("Eta Leonis", 10.122, 16.76, 3.5),
      s("Algieba", 10.333, 19.84, 2.0),
      s("Adhafera", 10.278, 23.42, 3.4),
      s("Rasalas", 9.879, 26.01, 3.9),
      s("Ras Elased", 9.764, 23.77, 3.0),
      s("Zosma", 11.235, 20.52, 2.6),
      s("Chertan", 11.237, 15.43, 3.3),
      s("Denebola", 11.818, 14.57, 2.1),
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [2, 6], [6, 8], [8, 7], [7, 0]],
  },
  virgo: {
    stars: [
      s("Spica", 13.42, -11.16, 1.0),
      s("Porrima", 12.694, -1.45, 2.7),
      s("Vindemiatrix", 13.036, 10.96, 2.8),
      s("Minelauva", 12.927, 3.4, 3.4),
      s("Heze", 13.578, -0.6, 3.4),
      s("Zavijava", 11.845, 1.76, 3.6),
      s("Zaniah", 12.332, -0.67, 3.9),
      s("Syrma", 14.267, -6.0, 4.1),
      s("Mu Virginis", 14.718, -5.66, 3.9),
      s("Tau Virginis", 14.027, 1.54, 4.3),
      s("109 Virginis", 14.771, 1.89, 3.7),
    ],
    edges: [[5, 6], [6, 1], [1, 3], [3, 2], [1, 0], [3, 4], [4, 9], [9, 10], [0, 7], [7, 8]],
  },
  libra: {
    stars: [
      s("Zubenelgenubi", 14.848, -16.04, 2.8),
      s("Zubeneschamali", 15.283, -9.38, 2.6),
      s("Brachium", 15.068, -25.28, 3.3),
      s("Zubenelhakrabi", 15.592, -14.79, 3.9),
      s("Upsilon Librae", 15.617, -28.14, 3.6),
      s("Tau Librae", 15.645, -29.78, 3.7),
    ],
    edges: [[2, 0], [0, 1], [1, 3], [3, 0], [3, 4], [4, 5]],
  },
  scorpio: {
    stars: [
      s("Antares", 16.49, -26.43, 1.0),
      s("Alniyat", 16.353, -25.59, 2.9),
      s("Paikauhale", 16.598, -28.22, 2.8),
      s("Dschubba", 16.006, -22.62, 2.3),
      s("Acrab", 16.091, -19.81, 2.6),
      s("Fang", 15.98, -26.11, 2.9),
      s("Iklil", 15.948, -29.21, 3.9),
      s("Larawag", 16.836, -34.29, 2.3),
      s("Xamidimura", 16.864, -38.05, 3.0),
      s("Zeta Scorpii", 16.91, -42.36, 3.6),
      s("Eta Scorpii", 17.203, -43.24, 3.3),
      s("Sargas", 17.622, -43.0, 1.9),
      s("Iota Scorpii", 17.793, -40.13, 3.0),
      s("Girtab", 17.708, -39.03, 2.4),
      s("Shaula", 17.56, -37.1, 1.6),
      s("Lesath", 17.513, -37.3, 2.7),
    ],
    edges: [
      [4, 3], [3, 5], [5, 6], [3, 1], [1, 0], [0, 2], [2, 7], [7, 8],
      [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15],
    ],
  },
  sagittarius: {
    stars: [
      s("Kaus Australis", 18.403, -34.38, 1.8),
      s("Kaus Media", 18.35, -29.83, 2.7),
      s("Kaus Borealis", 18.466, -25.42, 2.8),
      s("Alnasl", 18.097, -30.42, 3.0),
      s("Nunki", 18.921, -26.3, 2.1),
      s("Phi Sagittarii", 18.761, -26.99, 3.2),
      s("Tau Sagittarii", 19.116, -27.67, 3.3),
      s("Ascella", 19.044, -29.88, 2.6),
      s("Eta Sagittarii", 18.294, -36.76, 3.1),
    ],
    edges: [[3, 1], [1, 0], [0, 3], [1, 2], [2, 5], [5, 1], [5, 4], [4, 6], [6, 7], [7, 5], [7, 0], [0, 8]],
  },
  capricorn: {
    stars: [
      s("Algedi", 20.3, -12.54, 3.6),
      s("Dabih", 20.35, -14.78, 3.1),
      s("Psi Capricorni", 20.768, -25.27, 4.1),
      s("Omega Capricorni", 20.864, -26.92, 4.1),
      s("Zeta Capricorni", 21.444, -22.41, 3.7),
      s("Nashira", 21.668, -16.66, 3.7),
      s("Deneb Algedi", 21.784, -16.13, 2.9),
      s("Theta Capricorni", 21.099, -17.23, 4.1),
      s("Iota Capricorni", 21.371, -16.83, 4.3),
    ],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 6], [6, 5], [5, 8], [8, 7], [7, 1]],
  },
  aquarius: {
    stars: [
      s("Sadalsuud", 21.526, -5.57, 2.9),
      s("Sadalmelik", 22.096, -0.32, 3.0),
      s("Sadachbia", 22.361, -1.39, 3.8),
      s("Zeta Aquarii", 22.48, -0.02, 3.6),
      s("Seat", 22.421, 1.38, 4.7),
      s("Eta Aquarii", 22.589, -0.12, 4.0),
      s("Ancha", 22.28, -7.78, 4.2),
      s("Lambda Aquarii", 22.877, -7.58, 3.7),
      s("Skat", 22.911, -15.82, 3.3),
      s("Albali", 20.795, -9.5, 3.8),
      s("88 Aquarii", 23.157, -21.17, 3.7),
      s("Phi Aquarii", 23.238, -6.05, 4.2),
    ],
    edges: [[9, 0], [0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [1, 6], [6, 7], [7, 11], [7, 8], [8, 10]],
  },
  pisces: {
    stars: [
      s("Alrescha", 2.034, 2.76, 3.8),
      s("Alpherg", 1.525, 15.35, 3.6),
      s("Torcular", 1.757, 9.16, 4.3),
      s("Nu Piscium", 1.69, 5.49, 4.4),
      s("Mu Piscium", 1.503, 6.14, 4.8),
      s("Epsilon Piscium", 1.049, 7.89, 4.3),
      s("Delta Piscium", 0.811, 7.59, 4.4),
      s("Omega Piscium", 23.988, 6.86, 4.0),
      s("Iota Piscium", 23.665, 5.63, 4.1),
      s("Theta Piscium", 23.466, 6.38, 4.3),
      s("Fumalsamakah", 23.286, 3.28, 3.7),
      s("Kappa Piscium", 23.449, 1.26, 4.9),
      s("Lambda Piscium", 23.7, 1.78, 4.5),
      s("Phi Piscium", 1.229, 24.58, 4.7),
      s("Upsilon Piscium", 1.325, 27.26, 4.8),
      s("Tau Piscium", 1.195, 30.09, 4.5),
    ],
    edges: [
      [10, 11], [11, 12], [12, 8], [8, 9], [9, 10], [8, 7], [7, 6], [6, 5],
      [5, 4], [4, 3], [3, 0], [0, 2], [2, 1], [1, 13], [13, 14], [14, 15],
    ],
  },
};
