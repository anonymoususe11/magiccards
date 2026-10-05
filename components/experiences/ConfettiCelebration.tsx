"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Piece {
  position: [number, number, number];
  rotation: [number, number, number];
  speed: number;
  spin: number;
  size: number;
}

export default function ConfettiCelebration() {
  const meshRef =
    useRef<THREE.InstancedMesh>(null);

  const pieces = useMemo<Piece[]>(() => {
    return Array.from({ length: 100 }, () => ({
      position: [
        (Math.random() - 0.5) * 12,
        Math.random() * 8 + 1,
        (Math.random() - 0.5) * 5,
      ],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ],
      speed: 1 + Math.random() * 2,
      spin: 1 + Math.random() * 3,
      size: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  const dummy = useMemo(
    () => new THREE.Object3D(),
    []
  );

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    pieces.forEach((piece, index) => {
      piece.position[1] -= piece.speed * delta;

      if (piece.position[1] < -4) {
        piece.position[1] = 7;
      }

      piece.rotation[0] +=
        piece.spin * delta;

      piece.rotation[1] +=
        piece.spin * 0.7 * delta;

      dummy.position.set(
        piece.position[0],
        piece.position[1],
        piece.position[2]
      );

      dummy.rotation.set(
        piece.rotation[0],
        piece.rotation[1],
        piece.rotation[2]
      );

      dummy.scale.set(
        piece.size,
        piece.size * 2,
        piece.size
      );

      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(
        index,
        dummy.matrix
      );
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, pieces.length]}
    >
      <boxGeometry args={[1, 1, 1]} />

      <meshStandardMaterial
        color="#ff6b9a"
        roughness={0.45}
      />
    </instancedMesh>
  );
}
