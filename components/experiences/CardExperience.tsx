"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Card } from "@/types/card";

const content: Record<string, {
  emoji: string;
  title: string;
}> = {
  birthday: {
    emoji: "🎂",
    title: "Happy Birthday!"
  },
  sorry: {
    emoji: "💙",
    title: "I'm Sorry"
  },
  friendship: {
    emoji: "🤝",
    title: "Friendship Forever"
  },
  "friendship-day": {
    emoji: "🌟",
    title: "Happy Friendship Day!"
  },
  "thank-you": {
    emoji: "🙏",
    title: "Thank You!"
  },
  congratulations: {
    emoji: "🎉",
    title: "Congratulations!"
  },
  eid: {
    emoji: "🌙",
    title: "Eid Mubarak!"
  },
  "best-wishes": {
    emoji: "✨",
    title: "Best Wishes!"
  },
  "get-well": {
    emoji: "🌸",
    title: "Get Well Soon!"
  },
  "good-luck": {
    emoji: "🍀",
    title: "Good Luck!"
  },
  "new-beginning": {
    emoji: "🌅",
    title: "A New Beginning"
  },
  custom: {
    emoji: "✨",
    title: "A Little Something For You"
  }
};

export default function CardExperience({
  card
}: {
  card: Card;
}) {
  const [stage, setStage] = useState(0);
  const [muted, setMuted] = useState(false);

  const info = content[card.type] || content.custom;

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage(1);
    }, 1300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10"
    >
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            initial={{
              x: `${(i * 47) % 100}%`,
              y: "110%",
              opacity: 0
            }}
            animate={{
              y: "-20%",
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 7 + (i % 4),
              delay: i * 0.18,
              repeat: Infinity
            }}
          >
            {["✨", "🎈", "⭐", "💫"][i % 4]}
          </motion.div>
        ))}
      </div>

      <motion.section
        initial={{ opacity: 0, scale: .92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: .7 }}
        className="glass glow card-shadow relative z-10 w-full max-w-2xl rounded-[2rem] p-8 text-center md:p-12"
      >
        <div className="text-7xl">
          {info.emoji}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{
            opacity: stage >= 1 ? 1 : 0,
            y: stage >= 1 ? 0 : 12
          }}
          transition={{ delay: .25 }}
        >
          <p className="mt-8 text-sm uppercase tracking-[.35em] text-white/40">
            A message for
          </p>

          <h1 className="mt-3 text-4xl font-black md:text-6xl">
            {card.recipient_name}
          </h1>

          <h2 className="mt-5 text-2xl font-bold">
            {info.title}
          </h2>

          <div className="mx-auto mt-8 max-w-xl whitespace-pre-wrap text-lg leading-8 text-white/65">
            {card.message}
          </div>

          {card.sender_name && (
            <p className="mt-9 text-white/45">
              With love & good wishes,
              <br />
              <span className="font-semibold text-white/80">
                {card.sender_name}
              </span>
            </p>
          )}

          {card.type === "birthday" && (
            <div className="mt-10 text-6xl">
              🎂 🕯️ 🎈 🎁
            </div>
          )}

          <button
            onClick={() => setMuted(!muted)}
            className="mt-10 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-white/60 hover:bg-white/10"
          >
            {muted ? "🔇 Muted" : "🔊 Sound"}
          </button>
        </motion.div>
      </motion.section>
    </main>
  );
}
