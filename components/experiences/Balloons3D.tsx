"use client";

import { useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface Balloon {
  id: number;
  color: string;
  position: [number, number, number];
  scale: number;
}

interface BalloonItemProps {
  balloon: Balloon;
  popped: boolean;
  onPop: (id: number) => void;
}

function BalloonItem({
  balloon,
  popped,
  onPop,
}: BalloonItemProps) {
  const speed = 0.8 + balloon.id * 0.08;

  return (
    <Float
      speed={speed}
      rotationIntensity={0.35}
      floatIntensity={0.7}
    >
      <group position={balloon.position} scale={balloon.scale}>
        {!popped && (
          <>
            <mesh
              onClick={(event) => {
                event.stopPropagation();
                onPop(balloon.id);
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
            >
              <sphereGeometry args={[0.65, 32, 32]} />
              <meshStandardMaterial
                color={balloon.color}
                roughness={0.18}
                metalness={0.05}
              />
            </mesh>

            <mesh position={[0, -0.78, 0]}>
              <coneGeometry args={[0.09, 0.22, 16]} />
              <meshStandardMaterial color={balloon.color} />
            </mesh>

            <mesh position={[0, -1.65, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 1.7, 8]} />
              <meshStandardMaterial
                color="#eeeeee"
                roughness={0.8}
              />
            </mesh>
          </>
        )}
      </group>
    </Float>
  );
}

function BalloonScene({
  poppedIds,
  onPop,
}: {
  poppedIds: number[];
  onPop: (id: number) => void;
}) {
  const balloons = useMemo<Balloon[]>(
    () => [
      {
        id: 1,
        color: "#ff5c8a",
        position: [-3.2, 1.2, 0],
        scale: 0.95,
      },
      {
        id: 2,
        color: "#ffcf56",
        position: [-2, 2.5, -0.5],
        scale: 0.8,
      },
      {
        id: 3,
        color: "#62c8ff",
        position: [-0.7, 1.6, 0.2],
        scale: 1,
      },
      {
        id: 4,
        color: "#b486ff",
        position: [0.8, 2.5, -0.3],
        scale: 0.85,
      },
      {
        id: 5,
        color: "#ff8c55",
        position: [2.2, 1.5, 0],
        scale: 1,
      },
      {
        id: 6,
        color: "#65e6b1",
        position: [3.2, 2.7, -0.4],
        scale: 0.8,
      },
      {
        id: 7,
        color: "#ff72c5",
        position: [3.4, 0.2, 0.1],
        scale: 0.9,
      },
    ],
    []
  );

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[3, 6, 5]}
        intensity={3}
      />
      <pointLight
        position={[-4, 2, 4]}
        intensity={10}
        distance={12}
      />

      {balloons.map((balloon) => (
        <BalloonItem
          key={balloon.id}
          balloon={balloon}
          popped={poppedIds.includes(balloon.id)}
          onPop={onPop}
        />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

export default function Balloons3D({
  poppedIds,
  onPop,
}: {
  poppedIds: number[];
  onPop: (id: number) => void;
}) {
  return (
    <Canvas
      camera={{
        position: [0, 1.5, 9],
        fov: 48,
      }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#090b1d"]} />

      <Balloons3DScene
        poppedIds={poppedIds}
        onPop={onPop}
      />
    </Canvas>
  );
}

function Balloons3DScene({
  poppedIds,
  onPop,
}: {
  poppedIds: number[];
  onPop: (id: number) => void;
}) {
  useFrame(() => {});

  return (
    <BalloonScene
      poppedIds={poppedIds}
      onPop={onPop}
    />
  );
}
