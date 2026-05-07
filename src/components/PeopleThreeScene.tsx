"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

function OrgLayers() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  const { layerPoints, connLines } = useMemo(() => {
    const layers: number[] = [];
    const conns: number[] = [];
    const layerCount = 4;
    const pointsPerLayer = 18;
    const layerPositions: [number, number, number][][] = [];

    for (let l = 0; l < layerCount; l++) {
      const y = (l - (layerCount - 1) / 2) * 1.8;
      const radius = 1.2 + l * 0.4;
      const pts: [number, number, number][] = [];
      for (let p = 0; p < pointsPerLayer; p++) {
        const angle = (p / pointsPerLayer) * Math.PI * 2;
        const jitter = (Math.random() - 0.5) * 0.3;
        const x = Math.cos(angle) * (radius + jitter);
        const z = Math.sin(angle) * (radius + jitter);
        layers.push(x, y, z);
        pts.push([x, y, z]);
      }
      layerPositions.push(pts);
    }

    // Connect adjacent layers with lines
    for (let l = 0; l < layerCount - 1; l++) {
      const from = layerPositions[l];
      const to = layerPositions[l + 1];
      for (let p = 0; p < pointsPerLayer; p += 3) {
        const tp = Math.floor(Math.random() * pointsPerLayer);
        conns.push(...from[p], ...to[tp]);
      }
    }

    return {
      layerPoints: new Float32Array(layers),
      connLines: new Float32Array(conns),
    };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += 0.004;
    groupRef.current.rotation.x = 0.4 + Math.sin(t * 0.15) * 0.08;
    groupRef.current.position.x += (mouse.x * 0.6 - groupRef.current.position.x) * 0.035;
    groupRef.current.position.y += (mouse.y * 0.4 - groupRef.current.position.y) * 0.035;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[layerPoints, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#C9A85C" size={0.1} sizeAttenuation transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connLines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9A85C" transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>
    </group>
  );
}

function PulsingRings() {
  const ringsRef = useRef<THREE.Group>(null!);

  const rings = useMemo(() => {
    return Array.from({ length: 4 }, (_, i) => {
      const count = 80 + i * 20;
      const radius = 2.0 + i * 1.1;
      const pos = new Float32Array(count * 3);
      for (let j = 0; j < count; j++) {
        const angle = (j / count) * Math.PI * 2;
        pos[j * 3]     = Math.cos(angle) * radius;
        pos[j * 3 + 1] = (i - 1.5) * 1.6;
        pos[j * 3 + 2] = Math.sin(angle) * radius;
      }
      return { pos, phase: i * 0.8 };
    });
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ringsRef.current.rotation.y += 0.002;
    ringsRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Points).material as THREE.PointsMaterial;
      mat.opacity = 0.12 + Math.sin(t * 0.6 + rings[i].phase) * 0.08;
    });
  });

  return (
    <group ref={ringsRef}>
      {rings.map((ring, i) => (
        <points key={i}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ring.pos, 3]} />
          </bufferGeometry>
          <pointsMaterial color="#B5663A" size={0.025} sizeAttenuation transparent opacity={0.15} blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      ))}
    </group>
  );
}

function FallingDots() {
  const ref = useRef<THREE.Points>(null!);
  const COUNT = 100;

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18;
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
        pos[i * 3]     = (Math.random() - 0.5) * 18;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + Math.sin(state.clock.getElapsedTime() * 0.7) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#C9A85C" size={0.035} sizeAttenuation transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
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
        <OrgLayers />
        <PulsingRings />
        <FallingDots />
      </Suspense>
    </>
  );
}

export default function PeopleThreeScene() {
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
