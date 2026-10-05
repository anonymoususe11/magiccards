import { CardType } from "@/types/card";

export const CARD_TYPES: {
  id: CardType;
  title: string;
  emoji: string;
  description: string;
}[] = [
  {
    id: "birthday",
    title: "Birthday",
    emoji: "🎂",
    description: "Make their birthday unforgettable."
  },
  {
    id: "sorry",
    title: "Sorry",
    emoji: "💙",
    description: "Say sorry in a meaningful way."
  },
  {
    id: "friendship",
    title: "Friendship",
    emoji: "🤝",
    description: "Celebrate your friendship."
  },
  {
    id: "friendship-day",
    title: "Friendship Day",
    emoji: "🌟",
    description: "A special friendship surprise."
  },
  {
    id: "thank-you",
    title: "Thank You",
    emoji: "🙏",
    description: "Turn gratitude into a moment."
  },
  {
    id: "congratulations",
    title: "Congratulations",
    emoji: "🎉",
    description: "Celebrate their achievement."
  },
  {
    id: "eid",
    title: "Eid Mubarak",
    emoji: "🌙",
    description: "Send a beautiful Eid greeting."
  },
  {
    id: "best-wishes",
    title: "Best Wishes",
    emoji: "✨",
    description: "A beautiful wish for someone special."
  },
  {
    id: "get-well",
    title: "Get Well Soon",
    emoji: "🌸",
    description: "Send warmth and good wishes."
  },
  {
    id: "good-luck",
    title: "Good Luck",
    emoji: "🍀",
    description: "Wish them luck for what's ahead."
  },
  {
    id: "new-beginning",
    title: "New Beginning",
    emoji: "🌅",
    description: "Celebrate a fresh chapter."
  },
  {
    id: "custom",
    title: "Custom Card",
    emoji: "✨",
    description: "Create your own experience."
  }
];
