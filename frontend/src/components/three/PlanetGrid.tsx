// src/components/three/PlanetGrid.tsx (WIDER SPACING FOR VISIBILITY)
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Planet from './Planet';
import { RankingCandidate } from '@/lib/api';

interface PlanetGridProps {
  planets: RankingCandidate[];
  onPlanetClick?: (planet: RankingCandidate) => void;
}

export default function PlanetGrid({ planets, onPlanetClick }: PlanetGridProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Very gentle rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  // Calculate grid positions with WIDER spacing
  const getGridPosition = (index: number, total: number): [number, number, number] => {
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    
    // INCREASED spacing from 2.5 to 5.0 for better visibility
    const x = (col - cols / 2 + 0.5) * 5.0;
    const y = 0;
    const z = (row - rows / 2 + 0.5) * 5.0;
    
    return [x, y, z];
  };

  return (
    <group ref={groupRef}>
      {planets.map((planet, index) => (
        <Planet
          key={planet.planet_name}
          planet={planet}
          position={getGridPosition(index, planets.length)}
          onClick={() => onPlanetClick?.(planet)}
        />
      ))}
      
      {/* Grid floor - more visible */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[100, 100, 40, 40]} />
        <meshBasicMaterial 
          color="#1e293b" 
          wireframe 
          transparent 
          opacity={0.08}
        />
      </mesh>

      {/* Grid lines for reference */}
      <gridHelper 
        args={[100, 20, '#334155', '#1e293b']} 
        position={[0, -2, 0]}
      />
    </group>
  );
}