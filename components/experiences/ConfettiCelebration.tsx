"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConfettiProps {
  active: boolean;
  count?: number;
}

export function ConfettiCelebration({ active, count = 120 }: ConfettiProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    const colors = ["#FF4081", "#FFEB3B", "#00E676", "#00E5FF", "#7C4DFF", "#FF9100"];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 8
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        speed: Math.random() * 0.03 + 0.015,
        rotSpeed: Math.random() * 0.05 + 0.02,
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)]),
      });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!meshRef.current || !active) return;

    particles.forEach((p, i) => {
      p.position.y -= p.speed;
      if (p.position.y < -3) {
        p.position.y = 6;
      }
      p.rotation.x += p.rotSpeed;
      p.rotation.y += p.rotSpeed;

      dummy.position.copy(p.position);
      dummy.rotation.copy(p.rotation);
      dummy.scale.set(0.08, 0.08, 0.08);
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
      meshRef.current?.setColorAt(i, p.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial roughness={0.3} metalness={0.2} />
    </instancedMesh>
  );
}
