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
          <cylinderGeometry args={[1.35, 1.45, 0.
