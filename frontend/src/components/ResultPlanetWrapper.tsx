// src/components/ResultPlanetWrapper.tsx (COMPOSITION-AWARE)
'use client';

import { Sphere } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ResultPlanetWrapperProps {
  isHabitable: boolean;
  compositionType?: 'rocky' | 'super_earth' | 'neptune' | 'jupiter';
}

export default function ResultPlanetWrapper({ 
  isHabitable, 
  compositionType = 'rocky' 
}: ResultPlanetWrapperProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  // Planet colors based on composition and habitability
  const getPlanetProperties = () => {
    switch (compositionType) {
      case 'rocky':
        return {
          color: isHabitable ? '#10b981' : '#8b4513', // Green or brown
          emissive: isHabitable ? '#10b981' : '#6b3410',
          roughness: 0.8,
          metalness: 0.2,
          label: 'Rocky Planet'
        };
      
      case 'super_earth':
        return {
          color: isHabitable ? '#3b82f6' : '#4169e1', // Blue tones
          emissive: isHabitable ? '#1e40af' : '#2e4a7c',
          roughness: 0.6,
          metalness: 0.3,
          label: 'Super-Earth'
        };
      
      case 'neptune':
        return {
          color: '#06b6d4', // Cyan
          emissive: '#0891b2',
          roughness: 0.4,
          metalness: 0.4,
          label: 'Neptune-like'
        };
      
      case 'jupiter':
        return {
          color: '#f59e0b', // Amber/orange
          emissive: '#d97706',
          roughness: 0.5,
          metalness: 0.3,
          label: 'Jupiter-like'
        };
      
      default:
        return {
          color: '#6b7280',
          emissive: '#4b5563',
          roughness: 0.7,
          metalness: 0.2,
          label: 'Unknown'
        };
    }
  };

  const props = getPlanetProperties();
  
  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color={props.color}
        roughness={props.roughness}
        metalness={props.metalness}
        emissive={props.emissive}
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}