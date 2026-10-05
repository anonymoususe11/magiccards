"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CandleProps {
  index: number;
  position: [number, number, number];
  isLit: boolean;
  onBlowOut: (index: number) => void;
}

const Candle = ({ index, position, isLit, onBlowOut }: CandleProps) => {
  const flameRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (isLit && flameRef.current && lightRef.current) {
      const t = state.clock.getElapsedTime() * 8 + index;
      const flicker = Math.sin(t) * 0.15 + Math.cos(t * 1.7) * 0.1;
      flameRef.current.scale.setScalar(1 + flicker * 0.3);
      lightRef.current.intensity = 1.2 + flicker * 0.4;
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.5, 16]} />
        <meshStandardMaterial color="#FFF8E7" roughness={0.3} />
      </mesh>

      {/* Decorative Spiral Stripe */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.038, 0.038, 0.48, 16]} />
        <meshStandardMaterial color="#FF4081" roughness={0.4} transparent opacity={0.4} />
      </mesh>

      {/* Wick */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.08, 8]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Flame & Light */}
      {isLit && (
        <group
          ref={flameRef}
          position={[0, 0.6, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onBlowOut(index);
          }}
        >
          <mesh>
            <coneGeometry args={[0.045, 0.12, 12]} />
            <meshBasicMaterial color="#FF9800" />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
            <coneGeometry args={[0.025, 0.08, 12]} />
            <meshBasicMaterial color="#FFEB3B" />
          </mesh>
          <pointLight
            ref={lightRef}
            color="#FF9800"
            intensity={1.5}
            distance={2.5}
            decay={2}
          />
        </group>
      )}
    </group>
  );
};

const Strawberry = ({ position }: { position: [number, number, number] }) => (
  <group position={position}>
    <mesh castShadow>
      <coneGeometry args={[0.07, 0.12, 12]} />
      <meshStandardMaterial color="#D50000" roughness={0.25} metalness={0.1} />
    </mesh>
    <mesh position={[0, 0.06, 0]}>
      <cylinderGeometry args={[0.03, 0, 0.02, 6]} />
      <meshStandardMaterial color="#2E7D32" />
    </mesh>
  </group>
);

interface MagicCakeProps {
  isCut: boolean;
  litCandles: boolean[];
  onBlowCandle: (index: number) => void;
  showKnife: boolean;
  isCuttingAnimation: boolean;
}

export function MagicCake({
  isCut,
  litCandles,
  onBlowCandle,
  showKnife,
  isCuttingAnimation,
}: MagicCakeProps) {
  const mainGroupRef = useRef<THREE.Group>(null);
  const leftHalfRef = useRef<THREE.Group>(null);
  const rightHalfRef = useRef<THREE.Group>(null);
  const knifeRef = useRef<THREE.Group>(null);

  const [knifeY, setKnifeY] = useState(2.2);

  useFrame((state) => {
    // Gentle idle float
    if (mainGroupRef.current) {
      const t = state.clock.getElapsedTime();
      mainGroupRef.current.position.y = Math.sin(t * 1.2) * 0.04 - 0.2;
      mainGroupRef.current.rotation.y = Math.sin(t * 0.5) * 0.08;
    }

    // Knife Slicing Animation lerp
    if (isCuttingAnimation && knifeRef.current) {
      setKnifeY((prev) => THREE.MathUtils.lerp(prev, 0.2, 0.08));
    }

    // Split Halves Separation lerp
    const targetSeparation = isCut ? 0.35 : 0;
    if (leftHalfRef.current) {
      leftHalfRef.current.position.x = THREE.MathUtils.lerp(
        leftHalfRef.current.position.x,
        -targetSeparation,
        0.06
      );
    }
    if (rightHalfRef.current) {
      rightHalfRef.current.position.x = THREE.MathUtils.lerp(
        rightHalfRef.current.position.x,
        targetSeparation,
        0.06
      );
    }
  });

  // Candle placements on upper tier: 2 on Left half, 3 on Right half
  const candlesConfig: Array<{ index: number; position: [number, number, number]; side: "left" | "right" }> = [
    { index: 0, position: [-0.35, 1.0, 0.2], side: "left" },
    { index: 1, position: [-0.35, 1.0, -0.2], side: "left" },
    { index: 2, position: [0.35, 1.0, 0.3], side: "right" },
    { index: 3, position: [0.35, 1.0, -0.3], side: "right" },
    { index: 4, position: [0.1, 1.0, 0.4], side: "right" },
  ];

  const renderCakeHalf = (side: "left" | "right") => {
    // Left side: thetaStart = PI/2, thetaLength = PI
    // Right side: thetaStart = -PI/2, thetaLength = PI
    const thetaStart = side === "left" ? Math.PI / 2 : -Math.PI / 2;
    const thetaLength = Math.PI;

    return (
      <group>
        {/* Tier 1 - Bottom Tier */}
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.6, 32, 1, false, thetaStart, thetaLength]} />
          <meshStandardMaterial color="#FFF5E1" roughness={0.3} />
        </mesh>

        {/* Tier 1 Frosting Trim */}
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[1.53, 1.53, 0.08, 32, 1, false, thetaStart, thetaLength]} />
          <meshStandardMaterial color="#FF69B4" roughness={0.2} />
        </mesh>

        {/* Tier 2 - Top Tier */}
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.0, 1.0, 0.5, 32, 1, false, thetaStart, thetaLength]} />
          <meshStandardMaterial color="#FFF5E1" roughness={0.3} />
        </mesh>

        {/* Top Cream Frosting Layer */}
        <mesh position={[0, 1.05, 0]}>
          <cylinderGeometry args={[1.02, 1.02, 0.06, 32, 1, false, thetaStart, thetaLength]} />
          <meshStandardMaterial color="#F8BBD0" roughness={0.15} />
        </mesh>

        {/* Inner Sponge/Cream Filling Texture Plane on Cut Face */}
        <mesh position={[0, 0.55, 0]} rotation={[0, side === "left" ? Math.PI / 2 : -Math.PI / 2, 0]}>
          <planeGeometry args={[3.0, 1.1]} />
          <meshStandardMaterial color="#FFE0B2" roughness={0.6} />
        </mesh>

        {/* Strawberries */}
        {side === "left" ? (
          <>
            <Strawberry position={[-0.6, 1.12, 0.3]} />
            <Strawberry position={[-0.6, 1.12, -0.3]} />
          </>
        ) : (
          <>
            <Strawberry position={[0.6, 1.12, 0.4]} />
            <Strawberry position={[0.6, 1.12, -0.4]} />
            <Strawberry position={[0.8, 1.12, 0]} />
          </>
        )}

        {/* Candles assigned to this side */}
        {candlesConfig
          .filter((c) => c.side === side)
          .map((c) => (
            <Candle
              key={c.index}
              index={c.index}
              position={c.position}
              isLit={litCandles[c.index]}
              onBlowOut={onBlowCandle}
            />
          ))}
      </group>
    );
  };

  return (
    <group ref={mainGroupRef} position={[0, -0.2, 0]}>
      {/* Base Plate */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.0, 0.1, 48]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.1} metalness={0.1} />
      </mesh>

      {/* Cake Left Half */}
      <group ref={leftHalfRef}>{renderCakeHalf("left")}</group>

      {/* Cake Right Half */}
      <group ref={rightHalfRef}>{renderCakeHalf("right")}</group>

      {/* Knife Animated Model */}
      {showKnife && (
        <group ref={knifeRef} position={[0, knifeY, 0]} rotation={[0, 0, -Math.PI / 6]}>
          {/* Blade */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 1.2, 0.25]} />
            <meshStandardMaterial color="#E0E0E0" roughness={0.1} metalness={0.9} />
          </mesh>
          {/* Handle */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.4, 16]} />
            <meshStandardMaterial color="#5D4037" roughness={0.5} />
          </mesh>
        </group>
      )}
    </group>
  );
}
