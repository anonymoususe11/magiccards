export type CardType =
  | "birthday"
  | "sorry"
  | "friendship"
  | "friendship-day"
  | "thank-you"
  | "congratulations"
  | "eid"
  | "best-wishes"
  | "get-well"
  | "good-luck"
  | "new-beginning"
  | "custom";

export type ThemeName =
  | "elegant"
  | "colorful"
  | "dark"
  | "minimal"
  | "pastel"
  | "celebration"
  | "night"
  | "glass";

export interface Card {
  id: string;
  type: CardType;
  recipient_name: string;
  sender_name: string;
  message: string;
  birthday_date?: string | null;
  extra_data?: Record<string, unknown> | null;
  theme: ThemeName;
  photo_url?: string | null;
  music_url?: string | null;
  created_at?: string;
  expires_at?: string | null;
}
