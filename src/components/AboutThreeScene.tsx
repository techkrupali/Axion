"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { Points, PointMaterial } from "@react-three/drei";

function ArchitectureRings() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const rings = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => {
      const radius = 1.2 + i * 0.5;
      const count = 60 + i * 20;
      const positions = new Float32Array(count * 3);
      const tilt = (i * Math.PI) / 7;
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2;
        positions[j * 3] = Math.cos(angle) * radius;
        positions[j * 3 + 1] = Math.sin(angle) * radius * Math.cos(tilt);
        positions[j * 3 + 2] = Math.sin(angle) * radius * Math.sin(tilt);
      }
      return { positions, speed: 0.08 + i * 0.04, dir: i % 2 === 0 ? 1 : -1 };
    });
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.12;
    groupRef.current.rotation.x += delta * 0.04;
    const tx = mouse.x * 0.3;
    const ty = mouse.y * 0.3;
    groupRef.current.position.x += (tx - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (ty - groupRef.current.position.y) * 0.03;
  });

  const goldColor = new THREE.Color("#C9A85C");
  const dimColor = new THREE.Color("#8a6a30");

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <Points key={i} positions={ring.positions} stride={3} frustumCulled={false}>
          <PointMaterial
            transparent
            color={i % 2 === 0 ? goldColor : dimColor}
            size={0.05}
            sizeAttenuation
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.9 - i * 0.1}
          />
        </Points>
      ))}
    </group>
  );
}

function NodeWeb() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const positions = useMemo(() => {
    const pos = new Float32Array(1200 * 3);
    for (let i = 0; i < 1200; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta * 0.015;
    ref.current.rotation.z += delta * 0.008;
    const tx = mouse.x * 0.15;
    const ty = mouse.y * 0.15;
    ref.current.position.x += (tx - ref.current.position.x) * 0.015;
    ref.current.position.y += (ty - ref.current.position.y) * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#C9A85C"
        size={0.025}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.35}
      />
    </Points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight position={[8, 8, 8]} angle={0.2} penumbra={1} intensity={1.2} color="#C9A85C" />
      <pointLight position={[-8, -8, -8]} intensity={0.4} color="#B5663A" />
      <Suspense fallback={null}>
        <ArchitectureRings />
        <NodeWeb />
      </Suspense>
    </>
  );
}

export default function AboutThreeScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
