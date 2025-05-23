export interface TarotCardProps {
  src: string;
  sign: string;
  onClick: () => void;
}

export interface ZodiacSign {
  name: string;
  dates: string;
  today: string;
  cosmicTip: string;
} 