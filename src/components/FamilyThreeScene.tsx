"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function DoubleHelix() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const { strand1, strand2, rungs } = useMemo(() => {
    const s1: number[] = [];
    const s2: number[] = [];
    const r: number[] = [];
    const count = 80;
    const height = 12;
    const radius = 1.8;

    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6;
      const y = (i / count) * height - height / 2;

      const x1 = Math.cos(t) * radius;
      const z1 = Math.sin(t) * radius;
      const x2 = Math.cos(t + Math.PI) * radius;
      const z2 = Math.sin(t + Math.PI) * radius;

      s1.push(x1, y, z1);
      s2.push(x2, y, z2);

      // rungs every 4 steps
      if (i % 4 === 0) {
        r.push(x1, y, z1, x2, y, z2);
      }
    }

    return {
      strand1: new Float32Array(s1),
      strand2: new Float32Array(s2),
      rungs: new Float32Array(r),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += 0.005;
    groupRef.current.rotation.x = 0.3;
    groupRef.current.position.x += (mouse.x * 0.5 - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (mouse.y * 0.3 - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      {/* Strand 1 */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand1, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#C9A85C" size={0.12} sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Strand 2 */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[strand2, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#B5663A" size={0.12} sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>

      {/* Rungs connecting strands */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[rungs, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9A85C" transparent opacity={0.2} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function FallingDots() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 150;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random()) * 14 - 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i] = 0.01 + Math.random() * 0.02;
    }
    return { positions, velocities };
  }, []);

  useFrame((state) => {
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3 + 1] -= velocities[i];
      if (pos[i * 3 + 1] < -8) {
        pos[i * 3 + 1] = 8;
        pos[i * 3]     = (Math.random() - 0.5) * 20;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.35 + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A85C" size={0.04} sizeAttenuation transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1.0} color="#C9A85C" />
      <pointLight position={[-5, -5, 3]} intensity={0.4} color="#B5663A" />
      <Suspense fallback={null}>
        <DoubleHelix />
        <FallingDots />
      </Suspense>
    </>
  );
}

export default function FamilyThreeScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
