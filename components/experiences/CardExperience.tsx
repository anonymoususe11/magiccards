"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Sparkles } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { Card } from "@/types/card";

const content: Record<
  string,
  {
    emoji: string;
    title: string;
  }
> = {
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

function Flame() {
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flame.current) return;

    const t = clock.getElapsedTime();

    flame.current.scale.x = 0.85 + Math.sin(t * 8) * 0.12;
    flame.current.scale.y = 1 + Math.sin(t * 7) * 0.15;
    flame.current.rotation.z = Math.sin(t * 6) * 0.12;
  });

  return (
    <mesh ref={flame} position={[0, 1.15, 0]}>
      <sphereGeometry args={[0.13, 16, 16]} />
      <meshStandardMaterial
        color="#ffd166"
        emissive="#ff8c00"
        emissiveIntensity={2}
      />
    </mesh>
  );
}

function Candle({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.075, 0.075, 0.65, 20]} />
        <meshStandardMaterial color="#ff7eb6" />
      </mesh>

      <Flame />
    </group>
  );
}

function Cake() {
  const cake = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cake.current) return;

    const t = clock.getElapsedTime();

    cake.current.rotation.y = Math.sin(t * 0.35) * 0.12;
    cake.current.position.y = Math.sin(t * 0.8) * 0.05;
  });

  return (
    <Float
      speed={1.4}
      rotationIntensity={0.15}
      floatIntensity={0.35}
    >
      <group ref={cake}>
        {/* Bottom cake */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.75, 1.85, 0.8, 64]} />
          <meshStandardMaterial
            color="#ff8fab"
            roughness={0.35}
          />
        </mesh>

        {/* Cream layer */}
        <mesh position={[0, 0.48, 0]}>
          <cylinderGeometry args={[1.55, 1.65, 0.18, 64]} />
          <meshStandardMaterial
            color="#fff1f7"
            roughness={0.25}
          />
        </mesh>

        {/* Top cake */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[1.35, 1.45, 0.55, 64]} />
          <meshStandardMaterial
            color="#ffb3c6"
            roughness={0.35}
          />
        </mesh>

        {/* Top cream */}
        <mesh position={[0, 1.08, 0]}>
          <cylinderGeometry args={[1.3, 1.35, 0.12, 64]} />
          <meshStandardMaterial color="#fff7fb" />
        </mesh>

        {/* Candles */}
        <Candle position={[-0.65, 1.55, 0]} />
        <Candle position={[0, 1.55, 0]} />
        <Candle position={[0.65, 1.55, 0]} />

        {/* Cake plate */}
        <mesh position={[0, -0.48, 0]}>
          <cylinderGeometry args={[2.15, 2.15, 0.12, 64]} />
          <meshStandardMaterial
            color="#d9e7ff"
            metalness={0.35}
            roughness={0.25}
          />
        </mesh>
      </group>
    </Float>
  );
}

function Balloons() {
  const balloons = [
    {
      position: [-3.2, 1.5, -1] as [number, number, number],
      color: "#ff6b9a"
    },
    {
      position: [3.2, 1.2, -1] as [number, number, number],
      color: "#6ea8ff"
    },
    {
      position: [-3.6, -1.2, -0.5] as [number, number, number],
      color: "#ffd166"
    },
    {
      position: [3.6, -1.4, -0.5] as [number, number, number],
      color: "#a78bfa"
    }
  ];

  return (
    <>
      {balloons.map((balloon, index) => (
        <Float
          key={index}
          speed={1 + index * 0.15}
          rotationIntensity={0.1}
          floatIntensity={0.8}
        >
          <mesh position={balloon.position}>
            <sphereGeometry args={[0.65, 32, 32]} />
            <meshStandardMaterial
              color={balloon.color}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

function BirthdayScene() {
  return (
    <>
      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 6, 5]}
        intensity={3}
      />

      <pointLight
        position={[0, 3, 2]}
        intensity={2}
        distance={10}
      />

      <Sparkles
        count={120}
        scale={[10, 7, 7]}
        size={2}
        speed={0.4}
      />

      <Balloons />
      <Cake />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.35}
        minPolarAngle={Math.PI / 2.4}
        maxPolarAngle={Math.PI / 1.8}
      />
    </>
  );
}

export default function CardExperience({
  card
}: {
  card: Card;
}) {
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const info = content[card.type] || content.custom;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080612] text-white">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-500/10 blur-[120px]" />

        <div className="absolute left-0 top-0 h-[300px] w-[300px] rounded-full bg-purple-500/10 blur-[100px]" />

        <div className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      {/* 3D scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{
            position: [0, 1.5, 8],
            fov: 45
          }}
          dpr={[1, 2]}
        >
          <BirthdayScene />
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-end px-5 pb-10 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{
            opacity: started ? 1 : 0,
            y: started ? 0 : 25
          }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-white/40">
            A magical message for
          </p>

          <h1 className="mt-3 text-4xl font-black drop-shadow-lg md:text-6xl">
            {card.recipient_name}
          </h1>

          <h2 className="mt-3 text-2xl font-bold">
            {info.title}
          </h2>

          <div className="mx-auto mt-5 max-w-xl rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="whitespace-pre-wrap text-base leading-7 text-white/75 md:text-lg">
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
          </div>

          <div className="mt-5 flex justify-center gap-3">
            <button
              onClick={() => setMuted(!muted)}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-md transition hover:bg-white/20"
            >
              {muted ? "🔇 Sound Off" : "🔊 Sound"}
            </button>

            <button
              onClick={() => {
                navigator.clipboard?.writeText(
                  window.location.href
                );
              }}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm backdrop-blur-md transition hover:bg-white/20"
            >
              🔗 Copy Link
            </button>
          </div>
        </motion.div>

        {!started && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.8,
              duration: 0.6
            }}
            onClick={() => setStarted(true)}
            className="absolute bottom-10 rounded-full bg-white px-8 py-4 font-bold text-black shadow-2xl transition hover:scale-105"
          >
            Open Your Magic ✨
          </motion.button>
        )}
      </div>
    </main>
  );
}
