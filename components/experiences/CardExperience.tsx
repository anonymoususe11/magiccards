"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Card } from "@/types/card";
import { formatBirthdayDate } from "@/lib/utils";
import Balloons3D from "./Balloons3D";
import MagicCake from "./MagicCake";
import ConfettiCelebration from "./ConfettiCelebration";

type Stage =
  | "opening"
  | "balloons"
  | "candles"
  | "cutting"
  | "celebration"
  | "letter";

export default function CardExperience({
  card,
}: {
  card: Card;
}) {
  const [stage, setStage] =
    useState<Stage>("opening");

  const [poppedBalloons, setPoppedBalloons] =
    useState<number[]>([]);

  const [candlesOut, setCandlesOut] =
    useState<number[]>([]);

  const [cut, setCut] = useState(false);

  const birthdayDate = useMemo(
    () =>
      formatBirthdayDate(
        card.birthday_date
      ),
    [card.birthday_date]
  );

  const recipient =
    card.recipient_name?.trim() ||
    "Someone Special";

  const sender =
    card.sender_name?.trim() ||
    "Someone who cares";

  const message =
    card.message?.trim() ||
    "Wishing you a beautiful birthday filled with happiness.";

  function popBalloon(id: number) {
    setPoppedBalloons((current) => {
      if (current.includes(id)) {
        return current;
      }

      const updated = [...current, id];

      if (updated.length === 7) {
        setTimeout(() => {
          setStage("candles");
        }, 600);
      }

      return updated;
    });
  }

  function extinguishCandle(id: number) {
    setCandlesOut((current) => {
      if (current.includes(id)) {
        return current;
      }

      const updated = [...current, id];

      if (updated.length === 4) {
        setTimeout(() => {
          setStage("cutting");
        }, 700);
      }

      return updated;
    });
  }

  async function shareCard() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `A birthday surprise for ${recipient}`,
          text: `A special birthday card for ${recipient}`,
          url,
        });
      } catch {
        // User cancelled sharing.
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      alert("Card link copied!");
    } catch {
      alert(url);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#080914] text-white">
      <div className="relative min-h-screen">

        {/* BACKGROUND GLOW */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[120px]" />

          <div className="absolute right-0 top-0 h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[100px]" />

          <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-blue-500/10 blur-[100px]" />
        </div>

        <AnimatePresence mode="wait">

          {/* OPENING */}
          {stage === "opening" && (
            <motion.section
              key="opening"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                }}
              >
                <p className="mb-4 text-sm uppercase tracking-[0.35em] text-pink-200/70">
                  A little surprise
                </p>

                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                  For{" "}
                  <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-transparent">
                    {recipient}
                  </span>
                </h1>

                <p className="mx-auto mt-5 max-w-md text-white/60">
                  Someone made something special
                  just for you.
                </p>
              </motion.div>

              <motion.button
                type="button"
                onClick={() =>
                  setStage("balloons")
                }
                className="mt-10 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.2em] backdrop-blur-xl"
                animate={{
                  scale: [1, 1.04, 1],
                  boxShadow: [
                    "0 0 0 rgba(255,105,180,0)",
                    "0 0 35px rgba(255,105,180,.35)",
                    "0 0 0 rgba(255,105,180,0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                whileHover={{
                  scale: 1.07,
                }}
                whileTap={{
                  scale: 0.94,
                }}
              >
                ✨ Open Your Surprise
              </motion.button>
            </motion.section>
          )}

          {/* BALLOONS */}
          {stage === "balloons" && (
            <motion.section
              key="balloons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 min-h-screen"
            >
              <div className="absolute left-0 right-0 top-8 z-20 text-center">
                <h2 className="text-2xl font-bold">
                  Pop the balloons 🎈
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Tap each balloon to reveal
                  your surprise.
                </p>

                <p className="mt-3 text-xs text-white/40">
                  {poppedBalloons.length} / 7 popped
                </p>
              </div>

              <div className="h-screen w-full">
                <Balloons3D
                  poppedIds={poppedBalloons}
                  onPop={popBalloon}
                />
              </div>
            </motion.section>
          )}

          {/* CANDLES */}
          {stage === "candles" && (
            <motion.section
              key="candles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 min-h-screen"
            >
              <div className="absolute left-0 right-0 top-8 z-20 text-center">
                <h2 className="text-2xl font-bold">
                  Make a wish ✨
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Tap the candles to blow them out.
                </p>
              </div>

              <div className="h-screen w-full">
                <MagicCake
                  candlesOut={candlesOut}
                  onCandleClick={
                    extinguishCandle
                  }
                  cut={false}
                />
              </div>
            </motion.section>
          )}

          {/* CUTTING */}
          {stage === "cutting" && (
            <motion.section
              key="cutting"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 min-h-screen"
            >
              <div className="absolute left-0 right-0 top-8 z-20 text-center">
                <h2 className="text-2xl font-bold">
                  The cake is ready 🎂
                </h2>

                <p className="mt-2 text-sm text-white/60">
                  Cut the cake and reveal the
                  celebration.
                </p>
              </div>

              <div className="h-screen w-full">
                <MagicCake
                  candlesOut={candlesOut}
                  onCandleClick={
                    extinguishCandle
                  }
                  cut={cut}
                />
              </div>

              {!cut && (
                <div className="absolute bottom-10 left-0 right-0 z-20 flex justify-center">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setCut(true);

                      setTimeout(() => {
                        setStage(
                          "celebration"
                        );
                      }, 1300);
                    }}
                    className="rounded-full border border-white/20 bg-white/10 px-8 py-4 font-semibold backdrop-blur-xl"
                    whileHover={{
                      scale: 1.06,
                    }}
                    whileTap={{
                      scale: 0.94,
                    }}
                    animate={{
                      boxShadow: [
                        "0 0 0 rgba(255,255,255,0)",
                        "0 0 30px rgba(255,255,255,.25)",
                        "0 0 0 rgba(255,255,255,0)",
                      ],
                    }}
                    transition={{
                      duration: 1.8,
                      repeat: Infinity,
                    }}
                  >
                    🔪 Cut the Cake
                  </motion.button>
                </div>
              )}
            </motion.section>
          )}

          {/* CELEBRATION */}
          {stage === "celebration" && (
            <motion.section
              key="celebration"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <div className="absolute inset-0">
                <Canvas
                  camera={{
                    position: [0, 0, 8],
                    fov: 50,
                  }}
                  dpr={[1, 1.5]}
                >
                  <ambientLight intensity={1.5} />
                  <ConfettiCelebration />
                </Canvas>
              </div>

              <motion.div
                className="relative z-10"
                initial={{
                  opacity: 0,
                  scale: 0.7,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 150,
                }}
              >
                <div className="text-7xl">
                  🎉
                </div>

                <h1 className="mt-5 text-4xl font-black sm:text-6xl">
                  Happy Birthday,
                </h1>

                <h2 className="mt-2 bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 bg-clip-text text-4xl font-black text-transparent sm:text-6xl">
                  {recipient}! 🎂
                </h2>

                <p className="mx-auto mt-6 max-w-lg text-white/70">
                  Today is all about celebrating
                  you and the happiness you bring
                  into the world.
                </p>

                <motion.button
                  type="button"
                  onClick={() =>
                    setStage("letter")
                  }
                  className="mt-10 rounded-full bg-white px-8 py-4 font-bold text-black"
                  whileHover={{
                    scale: 1.06,
                  }}
                  whileTap={{
                    scale: 0.94,
                  }}
                >
                  💌 Open Your Letter
                </motion.button>
              </motion.div>
            </motion.section>
          )}

          {/* LETTER */}
          {stage === "letter" && (
            <motion.section
              key="letter"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="relative z-10 flex min-h-screen items-center justify-center px-5 py-12"
            >
              <div className="w-full max-w-xl rounded-[30px] border border-white/15 bg-white/[0.08] p-7 shadow-2xl backdrop-blur-2xl sm:p-10">
                <div className="text-center">
                  <div className="text-5xl">
                    💌
                  </div>

                  <p className="mt-5 text-sm uppercase tracking-[0.25em] text-pink-200/70">
                    A message for you
                  </p>

                  <h1 className="mt-3 text-3xl font-bold">
                    Dear {recipient}
                  </h1>
                </div>

                <div className="my-8 h-px bg-white/10" />

                <p className="whitespace-pre-wrap text-center text-lg leading-8 text-white/80">
                  {message}
                </p>

                {birthdayDate && (
                  <div className="mt-8 rounded-2xl bg-white/[0.06] p-4 text-center">
                    <p className="text-xs uppercase tracking-widest text-white/40">
                      Birthday
                    </p>

                    <p className="mt-1 font-medium text-white/80">
                      {birthdayDate}
                    </p>
                  </div>
                )}

                <div className="mt-8 text-center">
                  <p className="text-sm text-white/40">
                    With love & good wishes,
                  </p>

                  <p className="mt-1 text-lg font-semibold">
                    {sender}
                  </p>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <motion.button
                    type="button"
                    onClick={shareCard}
                    className="flex-1 rounded-full bg-white px-6 py-3 font-semibold text-black"
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    🔗 Share Card
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => {
                      setPoppedBalloons([]);
                      setCandlesOut([]);
                      setCut(false);
                      setStage("opening");
                    }}
                    className="flex-1 rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold"
                    whileTap={{
                      scale: 0.95,
                    }}
                  >
                    ↻ Replay
                  </motion.button>
                </div>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </div>
    </main>
  );
}
