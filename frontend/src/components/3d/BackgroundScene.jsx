import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

// Lightweight particle effect
const FloatingParticles = () => {
  const points = useRef()
  
  const count = 500
  const particles = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 30
    particles[i * 3 + 1] = (Math.random() - 0.5) * 30
    particles[i * 3 + 2] = (Math.random() - 0.5) * 30
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.05
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#8b5cf6"
        transparent
        opacity={0.3}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Minimal scene content
const SceneContent = () => {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.3} color="#6b21a8" />
      <pointLight position={[-10, -10, -10]} intensity={0.2} color="#06b6d4" />
      
      <Stars
        radius={100}
        depth={80}
        count={5000}
        factor={5}
        saturation={0}
        fade
        speed={0.2}
      />
      
      <FloatingParticles />
    </>
  )
}

// Lightweight background scene for other pages
const BackgroundScene = () => {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default BackgroundScene
