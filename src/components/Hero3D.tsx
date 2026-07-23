"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars, OrbitControls, Icosahedron, Torus } from "@react-three/drei";
import * as THREE from "three";

function Skyline() {
  const buildings = useMemo(() => {
    const arr: { x: number; z: number; h: number; key: string; hue: number }[] = [];
    const cols = 11;
    const rows = 11;
    let k = 0;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const dist = Math.hypot(i - cols / 2, j - rows / 2);
        if (dist < 1.6) continue; // central plaza
        const h = 0.6 + Math.random() * 3.4;
        arr.push({
          x: (i - cols / 2) * 1.05,
          z: (j - rows / 2) * 1.05,
          h,
          key: `b${k++}`,
          hue: Math.random(),
        });
      }
    }
    return arr;
  }, []);

  return (
    <group position={[0, -1.2, 0]}>
      {buildings.map((b) => (
        <mesh key={b.key} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
          <boxGeometry args={[0.82, b.h, 0.82]} />
          <meshStandardMaterial
            color={new THREE.Color().setHSL(0.58 + b.hue * 0.05, 0.35, 0.18 + b.hue * 0.06)}
            emissive={"#f59e0b"}
            emissiveIntensity={0.12}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
      ))}
      {/* glowing ground grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#070b16" metalness={0.4} roughness={0.8} />
      </mesh>
    </group>
  );
}

function FloatingShapes() {
  const group = useRef<THREE.Group>(null);
  const shapes = useMemo(
    () => [
      { pos: [-5, 2.5, -3] as const, scale: 0.9 },
      { pos: [5.2, 1.8, -4] as const, scale: 1.2 },
      { pos: [3.5, 3.4, 2] as const, scale: 0.7 },
      { pos: [-4, 3.6, 3] as const, scale: 0.8 },
    ],
    []
  );

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Float key={i} speed={2} rotationIntensity={1.4} floatIntensity={1.6}>
          <mesh position={s.pos} scale={s.scale}>
            <Icosahedron args={[1, 0]}>
              <meshStandardMaterial
                color="#0b1220"
                emissive="#38bdf8"
                emissiveIntensity={0.5}
                wireframe
              />
            </Icosahedron>
          </mesh>
        </Float>
      ))}
      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh position={[0, 4.2, -6]} scale={1.6}>
          <Torus args={[1, 0.18, 16, 60]}>
            <meshStandardMaterial
              color="#0b1220"
              emissive="#f59e0b"
              emissiveIntensity={0.6}
              wireframe
            />
          </Torus>
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 4.5, 14], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <color attach="background" args={["#060912"]} />
      <fog attach="fog" args={["#060912", 14, 34]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[8, 12, 6]} intensity={1.4} castShadow />
      <pointLight position={[-10, 6, -8]} intensity={120} color="#38bdf8" />
      <pointLight position={[10, 4, 8]} intensity={90} color="#f59e0b" />
      <Skyline />
      <FloatingShapes />
      <Stars radius={60} depth={40} count={1400} factor={4} saturation={0} fade speed={1} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.6}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2.1}
      />
    </Canvas>
  );
}
