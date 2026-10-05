"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Card } from "@/types/card";

const content: Record<
  string,
  {
    emoji: string;
    title: string;
  }
> = {
  birthday: { emoji: "🎂", title: "Happy Birthday!" },
  sorry: { emoji: "💙", title: "I'm Sorry" },
  friendship: { emoji: "🤝", title: "Friendship Forever" },
  "friendship-day": { emoji: "🌟", title: "Happy Friendship Day!" },
  "thank-you": { emoji: "🙏", title: "Thank You!" },
  congratulations: { emoji: "🎉", title: "Congratulations!" },
  eid: { emoji: "🌙", title: "Eid Mubarak!" },
  "best-wishes": { emoji: "✨", title: "Best Wishes!" },
  "get-well": { emoji: "🌸", title: "Get Well Soon!" },
  "good-luck": { emoji: "🍀", title: "Good Luck!" },
  "new-beginning": { emoji: "🌅", title: "A New Beginning" },
  custom: { emoji: "✨", title: "A Little Something For You" }
};

function Candle({
  position,
  blown,
  onBlow
}: {
  position: [number, number, number];
  blown: boolean;
  onBlow: () => void;
}) {
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flame.current || blown) return;

    const t = clock.getElapsedTime();

    flame.current.scale.x = 0.85 + Math.sin(t * 9) * 0.12;
    flame.current.scale.y = 1 + Math.sin(t * 8) * 0.16;
    flame.current.rotation.z = Math.sin(t * 7) * 0.12;
  });

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        if (!blown) onBlow();
      }}
    >
      {/* Candle */}
      <mesh>
        <cylinderGeometry args={[0.07, 0.075, 0.65, 24]} />
        <meshStandardMaterial
          color="#f8d7e8"
          roughness={0.3}
        />
      </mesh>

      {/* Flame */}
      {!blown && (
        <mesh ref={flame} position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.12, 20, 20]} />
          <meshStandardMaterial
            color="#ffd166"
            emissive="#ff8c00"
            emissiveIntensity={2.5}
          />
        </mesh>
      )}

      {/* Wick */}
      <mesh position={[0, 0.36, 0]}>
        <cylinderGeometry args={[0.018, 0.018, 0.08, 10]} />
        <meshStandardMaterial color="#292929" />
      </mesh>
    </group>
  );
}

function Strawberry({
  position,
  scale = 1
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial
          color="#e63950"
          roughness={0.3}
        />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.07, 0.16, 5]} />
        <meshStandardMaterial color="#4caf50" />
      </mesh>
    </group>
  );
}

function Cake({
  blownCandles,
  onBlowCandle,
  cut
}: {
  blownCandles: boolean[];
  onBlowCandle: (index: number) => void;
  cut: boolean;
}) {
  const cake = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cake.current) return;

    const t = clock.getElapsedTime();

    if (!cut) {
      cake.current.rotation.y =
        Math.sin(t * 0.35) * 0.08;

      cake.current.position.y =
        Math.sin(t * 0.8) * 0.035;
    }
  });

  const half = cut ? 0.72 : 0;

  return (
    <Float
      speed={1.1}
      rotationIntensity={0.08}
      floatIntensity={0.15}
    >
      <group ref={cake}>
        {/* Left / right cake body */}
        <group
          position={[-half, 0, 0]}
          rotation={[0, cut ? -0.03 : 0, 0]}
        >
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry
              args={[1.62, 1.72, 0.75, 64]}
            />
            <meshStandardMaterial
              color="#d98a70"
              roughness={0.55}
            />
          </mesh>

          {/* Cream */}
          <mesh position={[0, 0.43, 0]}>
            <cylinderGeometry
              args={[1.48, 1.58, 0.18, 64]}
            />
            <meshStandardMaterial
              color="#fff7f0"
              roughness={0.28}
            />
          </mesh>

          {/* Upper layer */}
          <mesh position={[0, 0.72, 0]}>
            <cylinderGeometry
              args={[1.32, 1.42, 0.52, 64]}
            />
            <meshStandardMaterial
              color="#e7a07f"
              roughness={0.5}
            />
          </mesh>

          {/* Top frosting */}
          <mesh position={[0, 1.02, 0]}>
            <cylinderGeometry
              args={[1.28, 1.34, 0.14, 64]}
            />
            <meshStandardMaterial
              color="#fffaf5"
              roughness={0.2}
            />
          </mesh>

          {/* Strawberries */}
          <Strawberry position={[-0.65, 1.18, 0.35]} />
          <Strawberry position={[0.55, 1.18, 0.3]} />
          <Strawberry position={[0, 1.2, -0.45]} scale={0.85} />
        </group>

        {/* Candles stay together above cake */}
        {!cut && (
          <>
            <Candle
              position={[-0.62, 1.48, 0]}
              blown={blownCandles[0]}
              onBlow={() => onBlowCandle(0)}
            />

            <Candle
              position={[0, 1.48, 0]}
              blown={blownCandles[1]}
              onBlow={() => onBlowCandle(1)}
            />

            <Candle
              position={[0.62, 1.48, 0]}
              blown={blownCandles[2]}
              onBlow={() => onBlowCandle(2)}
            />
          </>
        )}

        {/* Cake plate */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry
            args={[2.15, 2.15, 0.1, 64]}
          />
          <meshStandardMaterial
            color="#eeeeee"
            metalness={0.45}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Balloon({
  position,
  color,
  delay
}: {
  position: [number, number, number];
  color: string;
  delay: number;
}) {
  return (
    <Float
      speed={1 + delay}
      floatIntensity={0.9}
      rotationIntensity={0.12}
    >
      <group position={position}>
        <mesh scale={[0.82, 1, 0.82]}>
          <sphereGeometry args={[0.65, 32, 32]} />
          <meshStandardMaterial
            color={color}
            roughness={0.25}
            metalness={0.05}
          />
        </mesh>

        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry
            args={[0.012, 0.012, 1.5, 8]}
          />
          <meshStandardMaterial color="#aaaaaa" />
        </mesh>
      </group>
    </Float>
  );
}

function BirthdayScene({
  blownCandles,
  onBlowCandle,
  cut
}: {
  blownCandles: boolean[];
  onBlowCandle: (index: number) => void;
  cut: boolean;
}) {
  return (
    <>
      <ambientLight intensity={1.15} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={3.5}
        castShadow
      />

      <pointLight
        position={[0, 3, 2]}
        intensity={3}
        distance={9}
      />

      <pointLight
        position={[-4, 1, 2]}
        intensity={1.5}
        distance={8}
      />

      <Sparkles
        count={160}
        scale={[10, 8, 8]}
        size={1.8}
        speed={0.35}
      />

      <Balloon
        position={[-3.5, 2.2, -1]}
        color="#ff6f91"
        delay={0.1}
      />

      <Balloon
        position={[3.5, 2.4, -1]}
        color="#7aa7ff"
        delay={0.25}
      />

      <Balloon
        position={[-3.7, -0.8, -0.5]}
        color="#ffd166"
        delay={0.35}
      />

      <Balloon
        position={[3.7, -0.9, -0.5]}
        color="#a78bfa"
        delay={0.2}
      />

      <Cake
        blownCandles={blownCandles}
        onBlowCandle={onBlowCandle}
        cut={cut}
      />
    </>
  );
}

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        x: `${(i * 37) % 100}%`,
        delay: (i % 12) * 0.04,
        rotate: (i * 47) % 360
      })),
    []
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: piece.x,
            y: "-10%",
            opacity: 1,
            rotate: 0
          }}
          animate={{
            y: "110%",
            opacity: [1, 1, 0],
            rotate: piece.rotate + 720
          }}
          transition={{
            duration: 3 + (piece.id % 3),
            delay: piece.delay,
            ease: "easeIn"
          }}
          className="absolute h-3 w-2 rounded-sm bg-white"
        />
      ))}
    </div>
  );
}

export default function CardExperience({
  card
}: {
  card: Card;
}) {
  const info = content[card.type] || content.custom;

  const [started, setStarted] = useState(false);
  const [blownCandles, setBlownCandles] = useState([
    false,
    false,
    false
  ]);
  const [cut, setCut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [copied, setCopied] = useState(false);

  const allCandlesBlown = blownCandles.every(Boolean);

  function startExperience() {
    setStarted(true);
  }

  function blowCandle(index: number) {
    setBlownCandles((current) =>
      current.map((value, i) =>
        i === index ? true : value
      )
    );
  }

  function cutCake() {
    if (!allCandlesBlown) return;

    setCut(true);

    setTimeout(() => {
      setShowMessage(true);
    }, 850);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07050d] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[130px]" />

        <div className="absolute -left-20 top-0 h-[360px] w-[360px] rounded-full bg-purple-500/10 blur-[120px]" />

        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-blue-500/10 blur-[130px]" />
      </div>

      {/* 3D */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          started ? "opacity-100" : "opacity-30"
        }`}
      >
        <Canvas
          camera={{
            position: [0, 1.5, 8],
            fov: 42
          }}
          dpr={[1, 1.7]}
        >
          <BirthdayScene
            blownCandles={blownCandles}
            onBlowCandle={blowCandle}
            cut={cut}
          />
        </Canvas>
      </div>

      {/* Opening screen */}
      <AnimatePresence>
        {!started && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center px-6"
          >
            <div className="w-full max-w-md text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-7xl"
              >
                🎁
              </motion.div>

              <p className="mt-7 text-xs uppercase tracking-[0.45em] text-white/40">
                A little surprise
              </p>

              <h1 className="mt-4 text-3xl font-black md:text-5xl">
                Someone made something special for you
              </h1>

              <p className="mt-4 text-white/50">
                {card.recipient_name}, your magic is waiting...
              </p>

              <motion.button
                type="button"
                onClick={startExperience}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="mt-9 cursor-pointer rounded-full bg-white px-8 py-4 font-bold text-black shadow-[0_10px_50px_rgba(255,255,255,.18)]"
              >
                🎁 Open Your Birthday Surprise
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main controls */}
      {started && (
        <div className="relative z-20 flex min-h-screen flex-col items-center justify-end px-5 pb-8 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl text-center"
          >
            {!cut && (
              <div className="mb-5">
                <p className="text-xs uppercase tracking-[0.35em] text-white/40">
                  {allCandlesBlown
                    ? "Make a wish ✨"
                    : "Tap the candles to blow them out"}
                </p>
              </div>
            )}

            {allCandlesBlown && !cut && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={cutCake}
                className="mb-5 cursor-pointer rounded-full bg-white px-7 py-3 font-bold text-black shadow-xl"
              >
                🔪 Cut the Cake
              </motion.button>
            )}

            <AnimatePresence>
              {showMessage && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 35,
                    scale: 0.95
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  transition={{ duration: 0.8 }}
                  className="rounded-[2rem] border border-white/10 bg-black/45 p-6 shadow-2xl backdrop-blur-2xl md:p-8"
                >
                  <div className="text-4xl">
                    {info.emoji}
                  </div>

                  <p className="mt-4 text-xs uppercase tracking-[0.35em] text-white/40">
                    A message for
                  </p>

                  <h1 className="mt-2 text-3xl font-black md:text-5xl">
                    {card.recipient_name}
                  </h1>

                  <h2 className="mt-3 text-xl font-bold">
                    {info.title}
                  </h2>

                  <p className="mx-auto mt-5 max-w-xl whitespace-pre-wrap text-base leading-7 text-white/70">
                    {card.message}
                  </p>

                  {card.sender_name && (
                    <p className="mt-6 text-sm text-white/45">
                      With love & good wishes,
                      <br />
                      <span className="font-semibold text-white/80">
                        {card.sender_name}
                      </span>
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={copyLink}
                    className="mt-6 cursor-pointer rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm transition hover:bg-white/20"
                  >
                    {copied
                      ? "✅ Link Copied!"
                      : "🔗 Copy Link"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {cut && <Confetti />}
    </main>
  );
}
