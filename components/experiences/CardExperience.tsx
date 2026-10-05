"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Share2, RefreshCw, Heart } from "lucide-react";
import { Card } from "@/types/card";
import { formatBirthdayDate } from "@/lib/utils";
import { Balloons3D } from "./Balloons3D";
import { MagicCake } from "./MagicCake";
import { ConfettiCelebration } from "./ConfettiCelebration";

type Stage =
  | "opening"
  | "balloons"
  | "cake_reveal"
  | "candles"
  | "cake_cutting"
  | "celebration"
  | "letter";

interface CardExperienceProps {
  card: Card;
}

export function CardExperience({ card }: CardExperienceProps) {
  const [stage, setStage] = useState<Stage>("opening");
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);
  const [litCandles, setLitCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [isCuttingAnim, setIsCuttingAnim] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedDate = formatBirthdayDate(card.birthday_date);
  const totalBalloons = 7;

  // Auto-advance Stage 2 (Balloons) -> Stage 3 (Cake Reveal)
  useEffect(() => {
    if (stage === "balloons" && poppedBalloons.length >= totalBalloons) {
      const timer = setTimeout(() => {
        setStage("cake_reveal");
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [poppedBalloons, stage]);

  // Auto-advance Stage 3 -> Stage 4 (Candles)
  useEffect(() => {
    if (stage === "cake_reveal") {
      const timer = setTimeout(() => {
        setStage("candles");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Auto-advance Stage 4 (Candles) -> Stage 5 (Cake Cutting)
  useEffect(() => {
    if (stage === "candles" && litCandles.every((lit) => !lit)) {
      const timer = setTimeout(() => {
        setStage("cake_cutting");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [litCandles, stage]);

  const handlePopBalloon = (id: number) => {
    if (!poppedBalloons.includes(id)) {
      setPoppedBalloons((prev) => [...prev, id]);
    }
  };

  const handleBlowCandle = (index: number) => {
    if (litCandles[index]) {
      setLitCandles((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleCutCake = () => {
    setIsCuttingAnim(true);
    setTimeout(() => {
      setIsCakeCut(true);
      setTimeout(() => {
        setIsCuttingAnim(false);
        setStage("celebration");
      }, 1000);
    }, 600);
  };

  const handleShare = async () => {
    const shareData = {
      title: `Magic Card for ${card.recipient_name}`,
      text: `${card.recipient_name}, someone sent you a magical birthday surprise! ✨`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User canceled or share failed
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-purple-950 to-slate-900 select-none text-white">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* 3D Canvas Scene */}
      <Canvas shadows className="absolute inset-0 z-0">
        <PerspectiveCamera makeDefault position={[0, 1.2, 5]} fov={50} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 + 0.1}
          minPolarAngle={Math.PI / 4}
        />

        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 3, -2]} intensity={0.5} color="#A855F7" />

        {/* Stage 2 Balloons */}
        {stage === "balloons" && (
          <Balloons3D
            total={totalBalloons}
            poppedIds={poppedBalloons}
            onPopBalloon={handlePopBalloon}
          />
        )}

        {/* Stages 3 to 7: Birthday Cake Scene */}
        {stage !== "opening" && stage !== "balloons" && (
          <MagicCake
            isCut={isCakeCut}
            litCandles={litCandles}
            onBlowCandle={handleBlowCandle}
            showKnife={isCuttingAnim}
            isCuttingAnimation={isCuttingAnim}
          />
        )}

        {/* Confetti Celebration Particle Layer */}
        <ConfettiCelebration active={stage === "celebration" || stage === "letter"} />

        <ContactShadows
          position={[0, -0.75, 0]}
          opacity={0.6}
          scale={8}
          blur={1.5}
          far={4}
        />
      </Canvas>

      {/* Framer Motion Overlay UI */}
      <div className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-between p-6">
        {/* Header / Top Progress Banners */}
        <header className="w-full flex justify-center pt-4">
          <AnimatePresence mode="wait">
            {stage === "balloons" && (
              <motion.div
                key="banner-balloons"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-lg text-center"
              >
                <p className="text-sm font-medium tracking-wide text-pink-200">
                  Tap the balloons 🎈 ({poppedBalloons.length} / {totalBalloons})
                </p>
              </motion.div>
            )}

            {stage === "candles" && (
              <motion.div
                key="banner-candles"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-lg text-center"
              >
                <p className="text-sm font-medium tracking-wide text-amber-200">
                  Make a wish 🕯️ Tap each candle to blow it out
                </p>
              </motion.div>
            )}

            {stage === "celebration" && (
              <motion.div
                key="banner-celebration"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-amber-300 drop-shadow-md">
                  Happy Birthday, {card.recipient_name}! 🎉
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </header>

        {/* Stage Dynamic Center Interfaces */}
        <main className="flex-1 flex items-center justify-center pointer-events-auto">
          {/* Stage 1: Opening Experience */}
          {stage === "opening" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-md p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-semibold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Something Special For You ✨
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {card.recipient_name}
              </h1>

              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                Someone made a little magic specifically for you today.
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(236,72,153,0.4)",
                    "0 0 30px rgba(236,72,153,0.8)",
                    "0 0 15px rgba(236,72,153,0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={() => setStage("balloons")}
                className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg shadow-xl cursor-pointer border border-white/30"
              >
                OPEN YOUR SURPRISE 🎁
              </motion.button>
            </motion.div>
          )}

          {/* Stage 5: Cake Cutting Interactive Button */}
          {stage === "cake_cutting" && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                onClick={handleCutCake}
                disabled={isCuttingAnim}
                className="py-4 px-10 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 text-white font-extrabold text-xl shadow-2xl cursor-pointer border border-amber-200/40 tracking-wider"
              >
                🔪 CUT THE CAKE
              </motion.button>
            </motion.div>
          )}

          {/* Stage 6 Transition to Letter */}
          {stage === "celebration" && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-auto mb-6"
            >
              <button
                onClick={() => setStage("letter")}
                className="py-3 px-8 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-semibold text-sm tracking-wide transition shadow-lg cursor-pointer"
              >
                READ YOUR LETTER 💌
              </button>
            </motion.div>
          )}

          {/* Stage 7 & 8: Personalized Letter & Sharing */}
          {stage === "letter" && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="w-full max-w-lg p-8 rounded-3xl bg-slate-900/80 backdrop-blur-2xl border border-pink-500/30 shadow-2xl space-y-6 text-left my-auto"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="text-2xl font-bold text-pink-300">
                  Dear {card.recipient_name},
                </h2>
                {formattedDate && (
                  <span className="text-xs font-medium text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    {formattedDate}
                  </span>
                )}
              </div>

              {/* Dynamic Personalized Message Body with preserved whitespace */}
              <div className="text-slate-200 leading-relaxed text-sm md:text-base whitespace-pre-wrap max-h-60 overflow-y-auto pr-2">
                {card.message}
              </div>

              <div className="border-t border-white/10 pt-4 text-right">
                <p className="text-xs text-slate-400 uppercase tracking-widest">With love,</p>
                <p className="text-lg font-bold text-pink-400">
                  {card.sender_name || "Someone special"}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleShare}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  {copied ? "LINK COPIED! ✨" : "SHARE THIS MAGIC ✨"}
                </motion.button>

                <button
                  onClick={() => {
                    setPoppedBalloons([]);
                    setLitCandles([true, true, true, true, true]);
                    setIsCakeCut(false);
                    setStage("opening");
                  }}
                  className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> REPLAY
                </button>
              </div>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="w-full text-center pb-2">
          <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
            Made with <Heart className="w-3 h-3 text-pink-500 fill-pink-500" /> on MagicCards
          </p>
        </footer>
      </div>
    </div>
  );
}
