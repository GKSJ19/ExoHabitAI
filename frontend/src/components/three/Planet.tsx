// src/components/three/Planet.tsx (STARMAP STYLE - HIGHLY VISIBLE)
'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { RankingCandidate } from '@/lib/api';

interface PlanetProps {
  planet: RankingCandidate;
  position: [number, number, number];
  onClick?: () => void;
}

export default function Planet({ planet, position, onClick }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const probability = planet.habitability_probability;
  
  // Color based on habitability
  const color = probability >= 0.7 ? '#10b981' : 
                probability >= 0.5 ? '#3b82f6' :
                probability >= 0.3 ? '#f59e0b' : 
                '#6b7280';

  // Constant rotation for ring
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.5;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* Main planet sphere - LARGER and GLOWING */}
      <Sphere
        ref={meshRef}
        args={[0.8, 32, 32]} // Increased from 0.5 to 0.8
        onClick={onClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        scale={hovered ? 1.3 : 1}
      >
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.7}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.6} // Always glowing
        />
      </Sphere>

      {/* Outer glow sphere - always visible */}
      <Sphere args={[1.0, 16, 16]}>
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.3 : 0.15}
          depthWrite={false}
        />
      </Sphere>

      {/* Rotating ring - CAPTAIN MARVEL STYLE */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.2, 1.3, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.9 : 0.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Secondary ring (static) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.52, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered ? 0.6 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Scan lines effect on hover */}
      {hovered && (
        <>
          <mesh rotation={[0, 0, 0]}>
            <ringGeometry args={[0.2, 1.8, 64, 1, 0, Math.PI]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <ringGeometry args={[0.2, 1.8, 64, 1, 0, Math.PI]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}

      {/* Planet name - larger and always visible */}
      <Text
        position={[0, 2.0, 0]}
        fontSize={hovered ? 0.25 : 0.18}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        font="/fonts/mono.woff"
      >
        {planet.planet_name}
      </Text>

      {/* Probability - bright and visible */}
      <Text
        position={[0, -2.0, 0]}
        fontSize={hovered ? 0.22 : 0.16}
        color={color}
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        {(probability * 100).toFixed(1)}%
      </Text>

      {/* Rank badge */}
      <Text
        position={[0, 2.4, 0]}
        fontSize={0.12}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        RANK #{planet.rank}
      </Text>

      {/* Click indicator - always visible but brighter on hover */}
      <Text
        position={[0, -2.5, 0]}
        fontSize={0.11}
        color={hovered ? color : '#475569'}
        anchorX="center"
        anchorY="middle"
        font="/fonts/mono.woff"
      >
        {hovered ? '▶ CLICK FOR ANALYSIS' : '◉ CLICKABLE'}
      </Text>

      {/* Pulsing point light for extra visibility */}
      <pointLight
        position={[0, 0, 0]}
        color={color}
        intensity={hovered ? 3 : 1.5}
        distance={5}
      />
    </group>
  );
}