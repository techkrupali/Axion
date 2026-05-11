"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

const NODE_COUNT = 80;
const EDGE_THRESHOLD = 2.8;

function NeuralMesh() {
  const groupRef = useRef<THREE.Group>(null!);
  const { mouse } = useThree();

  // Generate node positions
  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 7,
      z: (Math.random() - 0.5) * 5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.8,
    }));
  }, []);

  // Build edges between nearby nodes
  const edges = useMemo(() => {
    const result: { a: number; b: number; dist: number }[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < EDGE_THRESHOLD) result.push({ a: i, b: j, dist });
      }
    }
    return result;
  }, [nodes]);

  // Node geometry — small spheres
  const nodePositions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 3);
    nodes.forEach((n, i) => {
      arr[i * 3] = n.x;
      arr[i * 3 + 1] = n.y;
      arr[i * 3 + 2] = n.z;
    });
    return arr;
  }, [nodes]);

  // Edge geometry
  const edgePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      arr[i * 6] = nodes[e.a].x;
      arr[i * 6 + 1] = nodes[e.a].y;
      arr[i * 6 + 2] = nodes[e.a].z;
      arr[i * 6 + 3] = nodes[e.b].x;
      arr[i * 6 + 4] = nodes[e.b].y;
      arr[i * 6 + 5] = nodes[e.b].z;
    });
    return arr;
  }, [edges, nodes]);

  const nodeGeoRef = useRef<THREE.BufferGeometry>(null!);
  const edgeGeoRef = useRef<THREE.BufferGeometry>(null!);
  const nodeMatRef = useRef<THREE.PointsMaterial>(null!);
  const edgeMatRef = useRef<THREE.LineSegments>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Slow drift rotation
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.04) * 0.15;

    // Mouse parallax
    const tx = mouse.x * 0.6;
    const ty = mouse.y * 0.4;
    groupRef.current.position.x += (tx - groupRef.current.position.x) * 0.025;
    groupRef.current.position.y += (ty - groupRef.current.position.y) * 0.025;

    // Pulse node sizes via opacity
    if (nodeMatRef.current) {
      nodeMatRef.current.opacity = 0.55 + Math.sin(t * 1.2) * 0.15;
    }

    // Animate node positions slightly (breathing)
    if (nodeGeoRef.current) {
      const pos = nodeGeoRef.current.attributes.position.array as Float32Array;
      nodes.forEach((n, i) => {
        pos[i * 3 + 1] = n.y + Math.sin(t * n.speed + n.phase) * 0.12;
      });
      nodeGeoRef.current.attributes.position.needsUpdate = true;
    }

    // Pulse edge opacity
    if (edgeMatRef.current) {
      (edgeMatRef.current as any).material.opacity = 0.08 + Math.sin(t * 0.8) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments ref={edgeMatRef}>
        <bufferGeometry ref={edgeGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[edgePositions, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#A0A0A0"
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      <points>
        <bufferGeometry ref={nodeGeoRef}>
          <bufferAttribute
            attach="attributes-position"
            args={[nodePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          ref={nodeMatRef}
          color="#A0A0A0"
          size={0.06}
          sizeAttenuation
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function SignalPulses() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const { positions, phases } = useMemo(() => {
    const count = 400;
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
      phases[i] = Math.random() * Math.PI * 2;
    }
    return { positions, phases };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.rotation.z = t * 0.02;
    const tx = mouse.x * 0.2;
    const ty = mouse.y * 0.2;
    ref.current.position.x += (tx - ref.current.position.x) * 0.01;
    ref.current.position.y += (ty - ref.current.position.y) * 0.01;

    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.12 + Math.sin(t * 0.6) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#707070"
        size={0.018}
        sizeAttenuation
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#A0A0A0" />
      <pointLight position={[-5, -5, 3]} intensity={0.4} color="#707070" />
      <Suspense fallback={null}>
        <NeuralMesh />
        <SignalPulses />
      </Suspense>
    </>
  );
}

export default function AIEdgeThreeScene() {
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
