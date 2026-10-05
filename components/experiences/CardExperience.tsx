"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  Sparkles,
  Text,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Card } from "@/types/card";

type Stage =
  | "intro"
  | "balloons"
  | "cake"
  | "candles"
  | "cut"
  | "celebration"
  | "letter";

type Props = {
  card: Card;
};

/* -------------------------------------------------------
   BACKGROUND
------------------------------------------------------- */

function Background() {
  return (
    <>
      <color attach="background" args={["#090616"]} />

      <fog attach="fog" args={["#090616", 8, 18]} />

      <ambientLight intensity={1.8} />

      <spotLight
        position={[4, 7, 5]}
        intensity={35}
        angle={0.5}
        penumbra={1}
        castShadow
      />

      <pointLight
        position={[-4, 3, 3]}
        intensity={15}
        distance={10}
      />

      <pointLight
        position={[4, 1, -3]}
        intensity={12}
        distance={10}
      />

      <Environment preset="studio" />
    </>
  );
}

/* -------------------------------------------------------
   BALLOON
------------------------------------------------------- */

type BalloonProps = {
  position: [number, number, number];
  color: string;
  popped: boolean;
  onPop: () => void;
  delay?: number;
};

function Balloon({
  position,
  color,
  popped,
  onPop,
  delay = 0,
}: BalloonProps) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!group.current || popped) return;

    const t = clock.getElapsedTime() + delay;

    group.current.position.y =
      position[1] + Math.sin(t * 1.2) * 0.18;

    group.current.rotation.z =
      Math.sin(t * 0.8 + delay) * 0.06;
  });

  if (popped) return null;

  return (
    <group
      ref={group}
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onPop();
      }}
    >
      <Float speed={1.2} rotationIntensity={0.15}>
        <mesh castShadow>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.18}
            metalness={0.05}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Balloon highlight */}
        <mesh position={[-0.18, 0.18, 0.52]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.75} />
        </mesh>

        {/* Knot */}
        <mesh position={[0, -0.65, 0]}>
          <coneGeometry args={[0.09, 0.16, 12]} />
          <meshStandardMaterial color={color} />
        </mesh>

        {/* String */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.1, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
}

/* -------------------------------------------------------
   CAKE HALF
------------------------------------------------------- */

type CakeHalfProps = {
  side: "left" | "right";
  cut: boolean;
};

function CakeHalf({ side, cut }: CakeHalfProps) {
  const isLeft = side === "left";

  const [x, z] = isLeft ? [-0.01, 0] : [0.01, 0];

  return (
    <group
      position={[
        cut ? (isLeft ? -0.75 : 0.75) : x,
        0,
        z,
      ]}
      rotation-y={isLeft ? 0 : Math.PI}
    >
      {/* Main cake */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[
            1.45,
            1.55,
            1.15,
            64,
            1,
            false,
            isLeft ? 0 : Math.PI,
            Math.PI,
          ]}
        />

        <meshStandardMaterial
          color="#d99a72"
          roughness={0.65}
        />
      </mesh>

      {/* Cream layer */}
      <mesh
        position={[0, 0.58, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            1.5,
            1.5,
            0.16,
            64,
            1,
            false,
            isLeft ? 0 : Math.PI,
            Math.PI,
          ]}
        />

        <meshStandardMaterial
          color="#fff4e8"
          roughness={0.4}
        />
      </mesh>

      {/* Top frosting */}
      <mesh
        position={[0, 0.68, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[
            1.35,
            1.42,
            0.28,
            64,
            1,
            false,
            isLeft ? 0 : Math.PI,
            Math.PI,
          ]}
        />

        <meshPhysicalMaterial
          color="#fffaf4"
          roughness={0.25}
          clearcoat={0.7}
        />
      </mesh>

      {/* Chocolate / berry decoration */}
      {[
        [-0.65, 0.86, 0.25],
        [-0.25, 0.88, 0.62],
        [0.2, 0.86, 0.65],
        [0.65, 0.86, 0.25],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          castShadow
        >
          <sphereGeometry args={[0.11, 20, 20]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#b51f45" : "#ffcf70"}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------
   CAKE
------------------------------------------------------- */

function Cake({
  cut,
  onCut,
}: {
  cut: boolean;
  onCut?: () => void;
}) {
  return (
    <group
      position={[0, -1.2, 0]}
      onClick={(e) => {
        e.stopPropagation();

        if (!cut && onCut) {
          onCut();
        }
      }}
    >
      <CakeHalf side="left" cut={cut} />
      <CakeHalf side="right" cut={cut} />

      {/* Cake plate */}
      <mesh position={[0, -0.62, 0]} receiveShadow>
        <cylinderGeometry args={[1.9, 2.05, 0.12, 64]} />
        <meshStandardMaterial
          color="#e8d7ff"
          metalness={0.15}
          roughness={0.25}
        />
      </mesh>

      {/* Plate rim */}
      <mesh position={[0, -0.54, 0]}>
        <torusGeometry args={[1.75, 0.045, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          metalness={0.25}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/* -------------------------------------------------------
   CANDLE
------------------------------------------------------- */

type CandleProps = {
  x: number;
  lit: boolean;
  onExtinguish: () => void;
};

function Candle({ x, lit, onExtinguish }: CandleProps) {
  const flame = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flame.current || !lit) return;

    const t = clock.getElapsedTime();

    flame.current.scale.y =
      1 + Math.sin(t * 14 + x) * 0.12;

    flame.current.scale.x =
      1 + Math.sin(t * 17 + x) * 0.08;
  });

  return (
    <group
      position={[x, 0.3, 0]}
      onClick={(e) => {
        e.stopPropagation();

        if (lit) {
          onExtinguish();
        }
      }}
    >
      {/* candle body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.65, 20]} />
        <meshStandardMaterial
          color="#fff8e9"
          roughness={0.35}
        />
      </mesh>

      {/* candle stripe */}
      <mesh position={[0, 0.02, 0]}>
        <torusGeometry args={[0.076, 0.012, 10, 24]} />
        <meshStandardMaterial color="#d99bff" />
      </mesh>

      {lit && (
        <>
          <mesh
            ref={flame}
            position={[0, 0.48, 0]}
          >
            <sphereGeometry args={[0.12, 20, 20]} />
            <meshBasicMaterial color="#ffd76a" />
          </mesh>

          <pointLight
            position={[0, 0.5, 0]}
            intensity={2.5}
            distance={2}
          />
        </>
      )}
    </group>
  );
}

/* -------------------------------------------------------
   CANDLES GROUP
------------------------------------------------------- */

function Candles({
  lights,
  onExtinguish,
}: {
  lights: boolean[];
  onExtinguish: (index: number) => void;
}) {
  const xs = [-0.72, -0.36, 0, 0.36, 0.72];

  return (
    <group position={[0, 1.35, 0]}>
      {xs.map((x, index) => (
        <Candle
          key={index}
          x={x}
          lit={lights[index]}
          onExtinguish={() => onExtinguish(index)}
        />
      ))}
    </group>
  );
}

/* -------------------------------------------------------
   CONFETTI
------------------------------------------------------- */

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        x: (Math.random() - 0.5) * 9,
        y: Math.random() * 6 + 2,
        z: (Math.random() - 0.5) * 4,
        color: [
          "#ff6b9d",
          "#ffd166",
          "#7dd3fc",
          "#c4b5fd",
          "#86efac",
          "#fb7185",
        ][i % 6],
        speed: 0.7 + Math.random() * 1.2,
      })),
    []
  );

  return (
    <group>
      {pieces.map((p, i) => (
        <ConfettiPiece key={i} {...p} />
      ))}
    </group>
  );
}

function ConfettiPiece({
  x,
  y,
  z,
  color,
  speed,
}: {
  x: number;
  y: number;
  z: number;
  color: string;
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;

    const t = clock.getElapsedTime();

    ref.current.position.y =
      y - ((t * speed) % 8);

    ref.current.rotation.x += 0.02;
    ref.current.rotation.z += 0.025;
  });

  return (
    <mesh ref={ref} position={[x, y, z]}>
      <boxGeometry args={[0.08, 0.18, 0.025]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

/* -------------------------------------------------------
   3D SCENE
------------------------------------------------------- */

function Scene({
  stage,
  balloons,
  popBalloon,
  candles,
  extinguishCandle,
  cutCake,
}: {
  stage: Stage;
  balloons: boolean[];
  popBalloon: (index: number) => void;
  candles: boolean[];
  extinguishCandle: (index: number) => void;
  cutCake: () => void;
}) {
  const showCake =
    stage === "cake" ||
    stage === "candles" ||
    stage === "cut" ||
    stage === "celebration";

  const showCandles =
    stage === "candles" ||
    stage === "cut" ||
    stage === "celebration";

  return (
    <>
      <Background />

      <Sparkles
        count={90}
        scale={[10, 7, 5]}
        size={2}
        speed={0.35}
      />

      {stage === "balloons" &&
        balloons.map((popped, index) => (
          <Balloon
            key={index}
            position={[
              -3.4 + index * 1.15,
              1.4 + (index % 2) * 0.55,
              0,
            ]}
            color={[
              "#ff6b9d",
              "#7dd3fc",
              "#c4b5fd",
              "#ffd166",
              "#86efac",
              "#fb7185",
            ][index]}
            popped={popped}
            delay={index * 0.5}
            onPop={() => popBalloon(index)}
          />
        ))}

      {showCake && (
        <Cake
          cut={stage === "cut" || stage === "celebration"}
          onCut={
            stage === "cut"
              ? cutCake
              : undefined
          }
        />
      )}

      {showCandles && (
        <Candles
          lights={candles}
          onExtinguish={extinguishCandle}
        />
      )}

      {stage === "celebration" && <Confetti />}

      <ContactShadows
        position={[0, -2.1, 0]}
        opacity={0.4}
        scale={7}
        blur={2.5}
      />
    </>
  );
}

/* -------------------------------------------------------
   MAIN EXPERIENCE
------------------------------------------------------- */

export default function CardExperience({
  card,
}: Props) {
  const [stage, setStage] =
    useState<Stage>("intro");

  const [balloons, setBalloons] =
    useState<boolean[]>(
      Array(6).fill(false)
    );

  const [candles, setCandles] =
    useState<boolean[]>(
      Array(5).fill(true)
    );

  const allBalloonsPopped =
    balloons.every(Boolean);

  const allCandlesOut =
    candles.every((v) => !v);

  /* Balloon progression */
  useEffect(() => {
    if (
      stage === "balloons" &&
      allBalloonsPopped
    ) {
      const timer = setTimeout(() => {
        setStage("cake");
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [stage, allBalloonsPopped]);

  /* Candle progression */
  useEffect(() => {
    if (
      stage === "candles" &&
      allCandlesOut
    ) {
      const timer = setTimeout(() => {
        setStage("cut");
      }, 900);

      return () => clearTimeout(timer);
    }
  }, [stage, allCandlesOut]);

  function popBalloon(index: number) {
    setBalloons((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }

  function extinguishCandle(index: number) {
    setCandles((prev) => {
      const next = [...prev];
      next[index] = false;
      return next;
    });
  }

  function startExperience() {
    setStage("balloons");
  }

  function beginCandles() {
    setStage("candles");
  }

  function cutCake() {
    setStage("celebration");
  }

  async function shareCard() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "A Magic Card For You ✨",
          text: `A special card from ${card.sender_name || "someone special"}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Card link copied!");
      }
    } catch {
      // user cancelled share
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#090616] text-white">
      {/* 3D */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          camera={{
            position: [0, 1, 8],
            fov: 42,
          }}
          dpr={[1, 1.75]}
          gl={{
            antialias: true,
            alpha: false,
          }}
        >
          <Scene
            stage={stage}
            balloons={balloons}
            popBalloon={popBalloon}
            candles={candles}
            extinguishCandle={extinguishCandle}
            cutCake={cutCake}
          />
        </Canvas>
      </div>

      {/* INTRO */}
      {stage === "intro" && (
        <div className="absolute inset-0 z-20 flex items-center justify-center px-6">
          <div className="w-full max-w-md text-center">
            <div className="mb-5 text-sm uppercase tracking-[0.35em] text-white/60">
              A little magic for you
            </div>

            <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-6xl">
              Something Special
            </h1>

            <p className="mx-auto mb-9 max-w-sm text-sm leading-6 text-white/65">
              {card.recipient_name}, someone has
              prepared a little surprise just for you.
            </p>

            <button
              type="button"
              onClick={startExperience}
              className="group relative mx-auto flex min-h-16 cursor-pointer items-center justify-center rounded-full border border-white/30 bg-white/15 px-9 text-sm font-semibold tracking-[0.18em] text-white shadow-[0_0_50px_rgba(210,170,255,0.35)] backdrop-blur-xl transition duration-300 hover:scale-105 hover:bg-white/25 active:scale-95"
            >
              <span className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-xl transition group-hover:bg-white/20" />

              OPEN YOUR SURPRISE
            </button>

            <div className="mt-5 text-xs text-white/35">
              Tap to begin ✨
            </div>
          </div>
        </div>
      )}

      {/* BALLOON INSTRUCTION */}
      {stage === "balloons" && (
        <div className="pointer-events-none absolute inset-x-0 top-10 z-20 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">
            Step 1
          </div>

          <h2 className="mt-2 text-2xl font-medium">
            Pop the balloons 🎈
          </h2>

          <p className="mt-2 text-sm text-white/55">
            Tap each balloon
          </p>

          <div className="mt-4 text-xs text-white/35">
            {balloons.filter(Boolean).length}/6 popped
          </div>
        </div>
      )}

      {/* CAKE INTRO */}
      {stage === "cake" && (
        <div className="absolute inset-x-0 top-10 z-20 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">
            Step 2
          </div>

          <h2 className="mt-2 text-3xl font-semibold">
            Your cake is here 🎂
          </h2>

          <p className="mt-2 text-sm text-white/55">
            Get ready for the candles
          </p>

          <button
            type="button"
            onClick={beginCandles}
            className="mt-6 cursor-pointer rounded-full border border-white/25 bg-white/15 px-7 py-3 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/25 active:scale-95"
          >
            LIGHT THE MOMENT ✨
          </button>
        </div>
      )}

      {/* CANDLES */}
      {stage === "candles" && (
        <div className="pointer-events-none absolute inset-x-0 top-10 z-20 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-white/50">
            Step 3
          </div>

          <h2 className="mt-2 text-3xl font-semibold">
            Make a wish 🕯️
          </h2>

          <p className="mt-2 text-sm text-white/55">
            Tap each candle to blow it out
          </p>
        </div>
      )}

      {/* CUT */}
      {stage === "cut" && (
        <div className="absolute inset-x-0 bottom-10 z-20 flex justify-center px-6">
          <button
            type="button"
            onClick={cutCake}
            className="cursor-pointer rounded-full border border-white/30 bg-white/15 px-9 py-4 text-sm font-semibold tracking-[0.18em] shadow-[0_0_40px_rgba(255,255,255,0.12)] backdrop-blur-xl transition hover:scale-105 hover:bg-white/25 active:scale-95"
          >
            🔪 CUT THE CAKE
          </button>
        </div>
      )}

      {/* CELEBRATION */}
      {stage === "celebration" && (
        <div className="absolute inset-0 z-20 flex items-end justify-center px-6 pb-10 text-center">
          <div className="w-full max-w-lg rounded-[2rem] border border-white/15 bg-black/20 p-6 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.3em] text-white/45">
              The magic is yours
            </div>

            <h2 className="mt-3 text-4xl font-semibold">
              Happy Birthday,
            </h2>

            <div className="mt-1 text-3xl font-medium text-white/85">
              {card.recipient_name}! 🎉
            </div>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/60">
              {card.message}
            </p>

            <button
              type="button"
              onClick={() => setStage("letter")}
              className="mt-6 cursor-pointer rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition hover:scale-105 active:scale-95"
            >
              OPEN YOUR LETTER 💌
            </button>
          </div>
        </div>
      )}

      {/* LETTER */}
      {stage === "letter" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-black/30 px-5 py-10 backdrop-blur-md">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/15 bg-white/10 p-7 shadow-2xl backdrop-blur-2xl sm:p-10">
            <div className="text-center">
              <div className="text-xs uppercase tracking-[0.3em] text-white/45">
                A little message
              </div>

              <h2 className="mt-3 text-4xl font-semibold">
                For {card.recipient_name}
              </h2>
            </div>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/15 p-6">
              <p className="whitespace-pre-wrap text-center text-base leading-8 text-white/80">
                {card.message}
              </p>
            </div>

            <div className="mt-7 text-center text-sm text-white/45">
              With love,
              <br />
              <span className="text-white/75">
                {card.sender_name || "Someone special"}
              </span>
            </div>

            <button
              type="button"
              onClick={shareCard}
              className="mt-8 w-full cursor-pointer rounded-full border border-white/20 bg-white/10 py-4 text-sm font-semibold backdrop-blur-xl transition hover:bg-white/20 active:scale-[0.98]"
            >
              SHARE THIS MAGIC ✨
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
