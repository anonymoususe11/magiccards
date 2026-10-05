"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

interface MagicCakeProps {
  candlesOut: number[];
  onCandleClick: (id: number) => void;
  cut: boolean;
}

function Candle({
  id,
  extinguished,
  onClick,
  x,
}: {
  id: number;
  extinguished: boolean;
  onClick: () => void;
  x: number;
}) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flameRef.current) return;

    const time = clock.getElapsedTime();

    flameRef.current.scale.x =
      0.85 + Math.sin(time * 10 + id) * 0.12;

    flameRef.current.scale.y =
      1 + Math.sin(time * 13 + id) * 0.15;
  });

  return (
    <group
      position={[x, 2.25, 0]}
      onClick={(event) => {
        event.stopPropagation();
        if (!extinguished) onClick();
      }}
    >
      <mesh>
        <cylinderGeometry args={[0.09, 0.09, 0.75, 24]} />
        <meshStandardMaterial
          color={id % 2 === 0 ? "#fff4cf" : "#ffd5e5"}
          roughness={0.35}
        />
      </mesh>

      {!extinguished && (
        <mesh
          ref={flameRef}
          position={[0, 0.55, 0]}
        >
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial
            color="#ff9d28"
            emissive="#ff5a00"
            emissiveIntensity={3}
          />
        </mesh>
      )}
    </group>
  );
}

function CakeModel({
  candlesOut,
  onCandleClick,
  cut,
}: MagicCakeProps) {
  const leftRef = useRef<THREE.Group>(null);
  const rightRef = useRef<THREE.Group>(null);

  const knifeRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!cut) {
      if (leftRef.current) {
        leftRef.current.position.x = 0;
      }

      if (rightRef.current) {
        rightRef.current.position.x = 0;
      }

      if (knifeRef.current) {
        knifeRef.current.position.y = 4;
        knifeRef.current.rotation.z = 0;
      }

      return;
    }

    let start: number | null = null;
    let frame = 0;

    const animate = (time: number) => {
      if (start === null) start = time;

      const progress = Math.min(
        (time - start) / 900,
        1
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      if (leftRef.current) {
        leftRef.current.position.x =
          -0.65 * eased;
      }

      if (rightRef.current) {
        rightRef.current.position.x =
          0.65 * eased;
      }

      if (knifeRef.current) {
        knifeRef.current.position.y =
          4 - 3.7 * eased;

        knifeRef.current.rotation.z =
          -0.18 * eased;
      }

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [cut]);

  return (
    <>
      <ambientLight intensity={1.3} />

      <directionalLight
        position={[4, 7, 5]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-4, 4, 4]}
        intensity={8}
        distance={12}
      />

      <Float
        speed={1}
        rotationIntensity={0.05}
        floatIntensity={0.15}
      >
        <group>

          {/* LEFT HALF */}
          <group ref={leftRef}>
            <mesh position={[-0.9, 0, 0]}>
              <cylinderGeometry
                args={[
                  2.5,
                  2.5,
                  0.8,
                  64,
                  1,
                  false,
                  Math.PI,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#f4b183"
                roughness={0.55}
              />
            </mesh>

            <mesh position={[-0.75, 0.65, 0]}>
              <cylinderGeometry
                args={[
                  2.15,
                  2.15,
                  0.35,
                  64,
                  1,
                  false,
                  Math.PI,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#fff4ec"
                roughness={0.3}
              />
            </mesh>

            <mesh position={[-0.7, 1.05, 0]}>
              <cylinderGeometry
                args={[
                  1.75,
                  1.75,
                  0.65,
                  64,
                  1,
                  false,
                  Math.PI,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#ffd7e5"
                roughness={0.4}
              />
            </mesh>
          </group>

          {/* RIGHT HALF */}
          <group ref={rightRef}>
            <mesh position={[0.9, 0, 0]}>
              <cylinderGeometry
                args={[
                  2.5,
                  2.5,
                  0.8,
                  64,
                  1,
                  false,
                  0,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#f4b183"
                roughness={0.55}
              />
            </mesh>

            <mesh position={[0.75, 0.65, 0]}>
              <cylinderGeometry
                args={[
                  2.15,
                  2.15,
                  0.35,
                  64,
                  1,
                  false,
                  0,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#fff4ec"
                roughness={0.3}
              />
            </mesh>

            <mesh position={[0.7, 1.05, 0]}>
              <cylinderGeometry
                args={[
                  1.75,
                  1.75,
                  0.65,
                  64,
                  1,
                  false,
                  0,
                  Math.PI,
                ]}
              />

              <meshStandardMaterial
                color="#ffd7e5"
                roughness={0.4}
              />
            </mesh>
          </group>

          {/* STRAWBERRIES */}
          {[
            [-1.1, 1.55, 0.2],
            [0, 1.7, 0.25],
            [1.1, 1.55, 0.2],
          ].map((position, index) => (
            <mesh
              key={index}
              position={position as [
                number,
                number,
                number
              ]}
              scale={[0.25, 0.3, 0.25]}
            >
              <sphereGeometry args={[1, 24, 24]} />
              <meshStandardMaterial
                color="#e63855"
                roughness={0.35}
              />
            </mesh>
          ))}

          {/* CANDLES */}
          {[-1.05, -0.35, 0.35, 1.05].map(
            (x, index) => (
              <Candle
                key={index}
                id={index}
                x={x}
                extinguished={candlesOut.includes(index)}
                onClick={() =>
                  onCandleClick(index)
                }
              />
            )
          )}

          {/* PLATE */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry
              args={[3.1, 3.1, 0.15, 64]}
            />

            <meshStandardMaterial
              color="#ffffff"
              roughness={0.25}
            />
          </mesh>

          {/* KNIFE */}
          {cut && (
            <group
              ref={knifeRef}
              position={[0, 4, 0.8]}
              rotation={[0, 0, 0]}
            >
              <mesh>
                <boxGeometry
                  args={[0.12, 3.2, 0.35]}
                />

                <meshStandardMaterial
                  color="#dce5ef"
                  metalness={0.9}
                  roughness={0.18}
                />
              </mesh>

              <mesh position={[0, 1.9, 0]}>
                <boxGeometry
                  args={[0.3, 0.9, 0.5]}
                />

                <meshStandardMaterial
                  color="#4a2c20"
                  roughness={0.45}
                />
              </mesh>
            </group>
          )}
        </group>
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </>
  );
}

export default function MagicCake(props: MagicCakeProps) {
  return (
    <Canvas
      camera={{
        position: [0, 1.5, 8],
        fov: 45,
      }}
      shadows
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#120b18"]} />

      <CakeModel {...props} />
    </Canvas>
  );
}
