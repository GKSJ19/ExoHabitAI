// src/components/three/OrbitalRings.tsx (NO % LABELS + CLEANER)
'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';
import { RankingCandidate } from '@/lib/api';

interface OrbitalRingsProps {
  planets: RankingCandidate[];
  onPlanetClick?: (planet: RankingCandidate) => void;
}

export default function OrbitalRings({ planets, onPlanetClick }: OrbitalRingsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  // Organize planets into 3 rings
  const getRingData = () => {
    const high = planets.filter(p => p.habitability_probability >= 0.7);
    const moderate = planets.filter(p => p.habitability_probability >= 0.5 && p.habitability_probability < 0.7);
    const low = planets.filter(p => p.habitability_probability < 0.5);

    return [
      { planets: high, radius: 6, color: '#10b981', label: 'HIGH', speed: 0.1 },
      { planets: moderate, radius: 10, color: '#3b82f6', label: 'MODERATE', speed: 0.07 },
      { planets: low, radius: 14, color: '#f59e0b', label: 'LOW', speed: 0.05 },
    ];
  };

  const rings = getRingData();

  return (
    <group>
      {/* Central sphere */}
      <Sphere args={[0.5, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          emissive="#ffffff" 
          emissiveIntensity={0.8}
        />
      </Sphere>
      
      {/* Fixed rings (billboarded to always face camera) */}
      {rings.map((ring, index) => (
        <FixedRing 
          key={`ring-${index}`}
          radius={ring.radius} 
          color={ring.color}
          label={ring.label}
        />
      ))}

      {/* Rotating planets */}
      {rings.map((ring, ringIndex) => (
        <RotatingPlanets
          key={`planets-${ringIndex}`}
          planets={ring.planets}
          radius={ring.radius}
          color={ring.color}
          speed={ring.speed}
          ringIndex={ringIndex}
          onPlanetClick={onPlanetClick}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </group>
  );
}

// Fixed ring that always faces camera
function FixedRing({ radius, color, label }: { radius: number; color: string; label: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (meshRef.current && camera) {
      meshRef.current.lookAt(camera.position);
    }
  });

  return (
    <group>
      {/* Main ring */}
      <mesh ref={meshRef}>
        <ringGeometry args={[radius - 0.15, radius + 0.15, 128]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.8} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Inner glow ring */}
      <mesh ref={meshRef}>
        <ringGeometry args={[radius - 0.3, radius + 0.3, 128]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.3} 
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Pulsing outer ring */}
      <PulsingRing radius={radius} color={color} />

      {/* Label */}
      <Html position={[radius + 2, 0, 0]} center>
        <div style={{
          color: color,
          fontFamily: 'monospace',
          fontSize: '14px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          whiteSpace: 'nowrap',
          textShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
        }}>
          {label}
        </div>
      </Html>
    </group>
  );
}

// Pulsing ring effect
function PulsingRing({ radius, color }: { radius: number; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (meshRef.current && camera) {
      meshRef.current.lookAt(camera.position);
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(state.clock.elapsedTime * 2) * 0.15;
    }
  });

  return (
    <mesh ref={meshRef}>
      <ringGeometry args={[radius - 0.5, radius + 0.5, 128]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.2} 
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// Planets that rotate around the center
interface RotatingPlanetsProps {
  planets: RankingCandidate[];
  radius: number;
  color: string;
  speed: number;
  ringIndex: number;
  onPlanetClick?: (planet: RankingCandidate) => void;
  hovered: number | null;
  setHovered: (index: number | null) => void;
}

function RotatingPlanets({ 
  planets, 
  radius, 
  color, 
  speed, 
  ringIndex,
  onPlanetClick,
  hovered,
  setHovered 
}: RotatingPlanetsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed;
    }
  });

  return (
    <group ref={groupRef}>
      {planets.slice(0, 8).map((planet, index) => {
        const angle = (index / Math.min(planets.length, 8)) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const globalIndex = ringIndex * 100 + index;

        return (
          <group key={planet.planet_name} position={[x, 0, z]}>
            {/* Large glowing planet */}
            <Sphere
              args={[0.6, 32, 32]}
              onClick={() => onPlanetClick?.(planet)}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(globalIndex);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = 'auto';
              }}
              scale={hovered === globalIndex ? 1.5 : 1}
            >
              <meshStandardMaterial
                color={color}
                roughness={0.2}
                metalness={0.8}
                emissive={color}
                emissiveIntensity={hovered === globalIndex ? 2 : 1.2}
              />
            </Sphere>

            {/* Bright glow halo */}
            <Sphere args={[1.0, 16, 16]}>
              <meshBasicMaterial
                color={color}
                transparent
                opacity={hovered === globalIndex ? 0.6 : 0.3}
                depthWrite={false}
              />
            </Sphere>

            {/* Ring around planet on hover */}
            {hovered === globalIndex && (
              <>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[1.2, 1.3, 32]} />
                  <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
                </mesh>
                <mesh rotation={[0, 0, 0]}>
                  <ringGeometry args={[1.2, 1.3, 32]} />
                  <meshBasicMaterial color={color} transparent opacity={0.9} side={THREE.DoubleSide} />
                </mesh>
              </>
            )}

            {/* Planet name - ONLY label, NO percentage */}
            <Html position={[0, 1.5, 0]} center style={{ pointerEvents: 'none' }}>
              <div style={{
                color: hovered === globalIndex ? '#ffffff' : '#94a3b8',
                fontFamily: 'monospace',
                fontSize: hovered === globalIndex ? '16px' : '12px',
                fontWeight: 'bold',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                textShadow: '0 0 10px rgba(0,0,0,0.8), 0 0 5px rgba(0,0,0,0.5)',
                transition: 'all 0.2s',
              }}>
                {planet.planet_name}
              </div>
            </Html>

            {/* NO PERCENTAGE LABEL - REMOVED */}

            {/* Click prompt on hover */}
            {hovered === globalIndex && (
              <Html position={[0, -1.5, 0]} center style={{ pointerEvents: 'none' }}>
                <div style={{
                  color: color,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  textShadow: `0 0 10px ${color}`,
                  animation: 'pulse 1s infinite',
                }}>
                  ▶ CLICK
                </div>
              </Html>
            )}

            {/* Bright point light */}
            <pointLight
              position={[0, 0, 0]}
              color={color}
              intensity={hovered === globalIndex ? 5 : 3}
              distance={8}
            />
          </group>
        );
      })}
    </group>
  );
}