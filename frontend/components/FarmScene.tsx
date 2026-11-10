"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sky } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

// Rolling agricultural fields
function Farmland() {
  const fieldRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (fieldRef.current) {
      fieldRef.current.position.x =
        Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
    }
  });

  return (
    <group ref={fieldRef}>
      {/* Main ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.2, -8]}
        receiveShadow
      >
        <planeGeometry args={[100, 100, 32, 32]} />
        <meshStandardMaterial color="#426c32" roughness={1} />
      </mesh>

      {/* Crop field rows */}
      {Array.from({ length: 35 }).map((_, index) => {
        const x = (index - 17) * 0.48;

        return (
          <group key={index}>
            <mesh
              position={[x, -0.08, -9]}
              rotation={[0, (index - 17) * 0.008, 0]}
            >
              <boxGeometry args={[0.28, 0.16, 42]} />

              <meshStandardMaterial
                color={index % 2 === 0 ? "#386d2d" : "#497d34"}
                roughness={0.95}
              />
            </mesh>
          </group>
        );
      })}

      {/* Foreground crop details */}
      {Array.from({ length: 45 }).map((_, index) => {
        const x = (index - 22) * 0.55;

        return (
          <mesh
            key={`crop-${index}`}
            position={[x, 0.12, 2 - (index % 4) * 0.5]}
          >
            <coneGeometry args={[0.12, 0.65, 5]} />

            <meshStandardMaterial
              color={index % 2 === 0 ? "#4c9139" : "#679d42"}
            />
          </mesh>
        );
      })}
    </group>
  );
}

// Distant rolling hills
function Hills() {
  return (
    <group position={[0, 0, -27]}>
      {Array.from({ length: 9 }).map((_, index) => (
        <mesh
          key={index}
          position={[(index - 4) * 8, 1 + Math.sin(index) * 1.5, -index * 0.7]}
          scale={[1.5, 0.8, 1]}
        >
          <sphereGeometry args={[5, 32, 24]} />

          <meshStandardMaterial
            color={index % 2 === 0 ? "#547d53" : "#6a8b62"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Distant mountain silhouettes
function Mountains() {
  return (
    <group position={[0, 0, -40]}>
      {Array.from({ length: 8 }).map((_, index) => (
        <mesh
          key={index}
          position={[(index - 3.5) * 9, 4 + (index % 3), -index * 0.5]}
        >
          <coneGeometry args={[8, 11 + (index % 3), 6]} />

          <meshStandardMaterial color="#718c7b" roughness={1} flatShading />
        </mesh>
      ))}
    </group>
  );
}

// Atmospheric sunlight
function Sunlight() {
  const lightRef = useRef<THREE.DirectionalLight>(null);

  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.position.x =
        8 + Math.sin(state.clock.elapsedTime * 0.05) * 1.5;
    }
  });

  return (
    <directionalLight
      ref={lightRef}
      position={[8, 12, 5]}
      intensity={2.2}
      color="#fff1ce"
      castShadow
    />
  );
}

// Complete landscape
function FarmEnvironment() {
  return (
    <>
      <Sky
        distance={450000}
        sunPosition={[5, 8, -10]}
        inclination={0.48}
        azimuth={0.25}
        rayleigh={2}
        turbidity={8}
        mieCoefficient={0.004}
        mieDirectionalG={0.8}
      />

      <fog attach="fog" args={["#b6cdbb", 22, 65]} />

      <ambientLight intensity={0.8} />

      <hemisphereLight color="#e3f4ff" groundColor="#536c37" intensity={1.2} />

      <Sunlight />

      <Farmland />

      <Hills />

      <Mountains />
    </>
  );
}

// Main scene
export default function FarmScene() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        shadows
        camera={{
          position: [0, 5, 15],
          fov: 48,
        }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
        }}
      >
        <FarmEnvironment />
      </Canvas>

      {/* Cinematic overlay for readable homepage text */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />

      {/* Atmospheric bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/35 to-transparent" />
    </div>
  );
}
