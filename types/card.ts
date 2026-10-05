export interface Card {
  id: string;
  type?: string;
  recipient_name: string;
  sender_name?: string | null;
  message: string;
  birthday_date?: string | null;
  theme?: string | null;
  photo_url?: string | null;
  music_url?: string | null;
  extra_data?: Record<string, unknown> | null;
  created_at?: string;
  expires_at?: string | null;
}
