"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function SignalWaves() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const waves = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => {
      const count = 120 + i * 20;
      const radius = 0.8 + i * 0.7;
      const pos = new Float32Array(count * 3);
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2;
        pos[j * 3]     = Math.cos(angle) * radius;
        pos[j * 3 + 1] = 0;
        pos[j * 3 + 2] = Math.sin(angle) * radius;
      }
      return { pos, radius, phase: i * 0.4 };
    });
  }, []);

  const waveRefs = useRef<(THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>> | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.x = 1.1;
    groupRef.current.rotation.z += 0.003;
    groupRef.current.position.x += (mouse.x * 0.5 - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (mouse.y * 0.3 - groupRef.current.position.y) * 0.03;

    waveRefs.current.forEach((ref, i) => {
      if (!ref) return;
      const mat = ref.material as THREE.PointsMaterial;
      mat.opacity = 0.15 + Math.sin(t * 1.2 - waves[i].phase * 1.5) * 0.35;
      // Ripple Y positions
      const pos = ref.geometry.attributes.position.array as Float32Array;
      const count = pos.length / 3;
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2;
        pos[j * 3 + 1] = Math.sin(angle * 3 + t * 1.5 - waves[i].phase) * 0.12;
      }
      ref.geometry.attributes.position.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {waves.map((wave, i) => (
        <points key={i} ref={(el) => { waveRefs.current[i] = el as THREE.Points<THREE.BufferGeometry<THREE.NormalBufferAttributes>> | null; }}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[wave.pos.slice(), 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#A0A0A0"
            size={i < 3 ? 0.05 : 0.03}
            sizeAttenuation
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      ))}
    </group>
  );
}

function CenterPulse() {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(3);
    pos[0] = 0; pos[1] = 0; pos[2] = 0;
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.size = 0.15 + Math.sin(t * 2) * 0.08;
    mat.opacity = 0.7 + Math.sin(t * 2) * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#A0A0A0" size={0.18} sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function FallingDots() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 120;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 14 - 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i] = 0.008 + Math.random() * 0.016;
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
    mat.opacity = 0.25 + Math.sin(state.clock.getElapsedTime() * 0.6) * 0.08;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#A0A0A0" size={0.03} sizeAttenuation transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 5, 5]} intensity={1.0} color="#A0A0A0" />
      <pointLight position={[-5, -4, 3]} intensity={0.4} color="#707070" />
      <Suspense fallback={null}>
        <SignalWaves />
        <CenterPulse />
        <FallingDots />
      </Suspense>
    </>
  );
}

export default function ConnectThreeScene() {
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
