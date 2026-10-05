export interface Card {
  id: string;
  type?: string;
  recipient_name: string;
  sender_name?: string | null;
  message: string;
  birthday_date?: string | null;
  theme?: string | null;
  extra_data?: Record<string, any> | null;
  created_at?: string;
}
