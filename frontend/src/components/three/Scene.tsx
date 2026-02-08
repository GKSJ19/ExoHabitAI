// src/components/three/Scene.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { ReactNode, Suspense } from 'react';

interface SceneProps {
  children: ReactNode;
  className?: string;
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
}

export default function Scene({ children, className = '', camera }: SceneProps) {
  return (
    <Canvas
      className={className}
      camera={{
        position: camera?.position || [0, 0, 10],
        fov: camera?.fov || 50,
      }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true,
        alpha: true,
      }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}