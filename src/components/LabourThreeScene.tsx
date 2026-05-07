"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";
import { PerspectiveCamera, MeshTransmissionMaterial } from "@react-three/drei";

/**
 * PREMIUM PARTICLE NETWORK
 * Elegant golden particles forming a dynamic constellation
 */
function ParticleNetwork() {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const { mouse } = useThree();

  const { positions, connections } = useMemo(() => {
    const count = 120;
    const pos = new Float32Array(count * 3);
    const conn: number[] = [];

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 8 + Math.random() * 6;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi) - 5;
    }

    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        
        if (dist < 3.5) {
          conn.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          conn.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    return { positions: pos, connections: new Float32Array(conn) };
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.08;
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.2;
      pointsRef.current.position.x += (mouse.x * 2 - pointsRef.current.position.x) * 0.02;
      pointsRef.current.position.y += (mouse.y * 1 - pointsRef.current.position.y) * 0.02;
    }
    
    if (linesRef.current) {
      linesRef.current.rotation.y = t * 0.08;
      linesRef.current.rotation.x = Math.sin(t * 0.05) * 0.2;
      linesRef.current.position.x = pointsRef.current.position.x;
      linesRef.current.position.y = pointsRef.current.position.y;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.12} color="#D4AF37" transparent opacity={0.9} sizeAttenuation blending={THREE.AdditiveBlending} />
      </points>
      
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={connections.length / 3} array={connections} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#C9A85C" transparent opacity={0.15} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </>
  );
}

/**
 * ELEGANT ROTATING RINGS
 * Luxury orbital rings with glass material
 */
function LuxuryRings() {
  const ring1 = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  const ring3 = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    if (ring1.current) {
      ring1.current.rotation.x = t * 0.15;
      ring1.current.rotation.y = t * 0.1;
    }
    if (ring2.current) {
      ring2.current.rotation.x = -t * 0.12;
      ring2.current.rotation.z = t * 0.08;
    }
    if (ring3.current) {
      ring3.current.rotation.y = t * 0.18;
      ring3.current.rotation.z = -t * 0.06;
    }
  });

  return (
    <group position={[0, 0, -5]}>
      <mesh ref={ring1}>
        <torusGeometry args={[5, 0.03, 16, 100]} />
        <meshStandardMaterial color="#D4AF37" emissive="#C9A85C" emissiveIntensity={0.4} metalness={1} roughness={0.2} transparent opacity={0.6} />
      </mesh>
      
      <mesh ref={ring2}>
        <torusGeometry args={[6.5, 0.025, 16, 100]} />
        <meshStandardMaterial color="#B8860B" emissive="#C9A85C" emissiveIntensity={0.3} metalness={1} roughness={0.3} transparent opacity={0.4} />
      </mesh>
      
      <mesh ref={ring3}>
        <torusGeometry args={[8, 0.02, 16, 100]} />
        <meshStandardMaterial color="#FFD700" emissive="#C9A85C" emissiveIntensity={0.2} metalness={1} roughness={0.4} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

/**
 * CENTRAL GLASS SPHERE
 * Premium glass orb with transmission material
 */
function GlassSphere() {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    sphereRef.current.rotation.y = t * 0.2;
    sphereRef.current.position.x += (mouse.x * 0.5 - sphereRef.current.position.x) * 0.03;
    sphereRef.current.position.y += (mouse.y * 0.3 - sphereRef.current.position.y) * 0.03;
  });

  return (
    <mesh ref={sphereRef} position={[0, 0, -5]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <MeshTransmissionMaterial
        backside
        samples={8}
        thickness={0.5}
        chromaticAberration={0.05}
        anisotropy={0.3}
        distortion={0.2}
        distortionScale={0.5}
        temporalDistortion={0.1}
        clearcoat={1}
        attenuationDistance={0.5}
        attenuationColor="#D4AF37"
        color="#ffffff"
        transparent
        opacity={0.8}
      />
    </mesh>
  );
}

/**
 * AMBIENT PARTICLES
 * Floating golden dust for atmosphere
 */
function AmbientDust() {
  const dustRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    dustRef.current.rotation.y = t * 0.02;
    
    const pos = dustRef.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 1] += Math.sin(t + i) * 0.002;
    }
    dustRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={dustRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#D4AF37" transparent opacity={0.3} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={45} />
      
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 15]} intensity={2} color="#D4AF37" />
      <pointLight position={[-10, -10, 10]} intensity={1.5} color="#FFD700" />
      <spotLight position={[0, 15, 10]} intensity={1} angle={0.3} penumbra={1} color="#C9A85C" />
      
      <Suspense fallback={null}>
        <GlassSphere />
        <LuxuryRings />
        <ParticleNetwork />
        <AmbientDust />
        
        <mesh position={[0, 0, -30]}>
          <planeGeometry args={[100, 100]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.8} />
        </mesh>
      </Suspense>
      
      <fog attach="fog" args={['#06070B', 15, 35]} />
    </>
  );
}

export default function LabourThreeScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ 
          alpha: true, 
          antialias: true, 
          stencil: false, 
          depth: true,
          powerPreference: "high-performance"
        }} 
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
