"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function CrystalForm() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const { edges, verts } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2, 1);
    const pos = geo.attributes.position;
    const edgeSet = new Set<string>();
    const edgeLines: number[] = [];
    const uniqueVerts: number[] = [];
    const vertSet = new Map<string, boolean>();

    for (let i = 0; i < pos.count; i += 3) {
      const tri = [i, i + 1, i + 2];
      for (let j = 0; j < 3; j++) {
        const a = tri[j], b = tri[(j + 1) % 3];
        const key = [a, b].sort().join("-");
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edgeLines.push(
            pos.getX(a), pos.getY(a), pos.getZ(a),
            pos.getX(b), pos.getY(b), pos.getZ(b)
          );
        }
        const vk = `${pos.getX(i).toFixed(2)},${pos.getY(i).toFixed(2)},${pos.getZ(i).toFixed(2)}`;
        if (!vertSet.has(vk)) {
          vertSet.set(vk, true);
          uniqueVerts.push(pos.getX(i), pos.getY(i), pos.getZ(i));
        }
      }
    }

    return {
      edges: new Float32Array(edgeLines),
      verts: new Float32Array(uniqueVerts),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += 0.003;
    groupRef.current.rotation.x = 0.3 + Math.sin(t * 0.2) * 0.08;
    groupRef.current.position.x += (mouse.x * 0.5 - groupRef.current.position.x) * 0.03;
    groupRef.current.position.y += (mouse.y * 0.3 - groupRef.current.position.y) * 0.03;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edges, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9A85C" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[verts, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#C9A85C" size={0.12} sizeAttenuation transparent opacity={1} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </group>
  );
}

function OrbitingParticles() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 200;

  const { positions, angles, radii, speeds, yOffsets } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const angles = new Float32Array(COUNT);
    const radii = new Float32Array(COUNT);
    const speeds = new Float32Array(COUNT);
    const yOffsets = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 2.5 + Math.random() * 3.5;
      speeds[i] = (0.002 + Math.random() * 0.004) * (Math.random() > 0.5 ? 1 : -1);
      yOffsets[i] = (Math.random() - 0.5) * 4;
    }
    return { positions, angles, radii, speeds, yOffsets };
  }, []);

  useFrame(() => {
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      angles[i] += speeds[i];
      pos[i * 3]     = Math.cos(angles[i]) * radii[i];
      pos[i * 3 + 1] = yOffsets[i];
      pos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A85C" size={0.04} sizeAttenuation transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function FallingDots() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 100;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 14 - 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      velocities[i] = 0.008 + Math.random() * 0.014;
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
      <pointsMaterial color="#B5663A" size={0.03} sizeAttenuation transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={1.0} color="#C9A85C" />
      <pointLight position={[-5, -4, 3]} intensity={0.4} color="#B5663A" />
      <Suspense fallback={null}>
        <CrystalForm />
        <OrbitingParticles />
        <FallingDots />
      </Suspense>
    </>
  );
}

export default function FounderThreeScene() {
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
