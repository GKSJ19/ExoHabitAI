// src/components/three/CameraController.tsx
'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CameraControllerProps {
  enableOrbit?: boolean;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
}

export default function CameraController({
  enableOrbit = true,
  autoRotate = false,
  autoRotateSpeed = 0.5,
  enableZoom = true,
  enablePan = false,
}: CameraControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Smooth camera movement based on mouse position
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!camera) return;
      
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Subtle parallax effect
      camera.position.x += (x * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (y * 0.5 - camera.position.y) * 0.05;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera]);

  if (!enableOrbit) return null;

  return (
    <OrbitControls
      ref={controlsRef}
      enableZoom={enableZoom}
      enablePan={enablePan}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      minDistance={5}
      maxDistance={30}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 4}
    />
  );
}