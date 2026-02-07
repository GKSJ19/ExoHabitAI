import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Environment, useTexture, Sphere, MeshDistortMaterial, Trail } from '@react-three/drei'
import * as THREE from 'three'

// Floating Planet Component
const Planet = ({ position = [0, 0, 0], size = 2, color = '#ff6b35' }) => {
  const meshRef = useRef()
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial 
          color={color}
          roughness={0.4}
          metalness={0.3}
          emissive={color}
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Planet rings */}
      <mesh position={position} rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[size * 1.5, 0.05, 16, 100]} />
        <meshStandardMaterial color="#ff9f6b" transparent opacity={0.6} />
      </mesh>
      <mesh position={position} rotation={[Math.PI / 2.2, 0.2, 0]}>
        <torusGeometry args={[size * 1.8, 0.03, 16, 100]} />
        <meshStandardMaterial color="#ffc09f" transparent opacity={0.4} />
      </mesh>
    </Float>
  )
}

// Orbiting Particles
const OrbitingParticles = ({ count = 500, radius = 10 }) => {
  const points = useRef()
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = radius + (Math.random() - 0.5) * 5
      
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)
      
      // Purple to blue gradient
      colors[i * 3] = 0.5 + Math.random() * 0.5
      colors[i * 3 + 1] = 0.2 + Math.random() * 0.3
      colors[i * 3 + 2] = 0.8 + Math.random() * 0.2
    }
    
    return { positions, colors }
  }, [count, radius])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0005
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.positions.length / 3}
          array={particles.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particles.colors.length / 3}
          array={particles.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Glass/Metallic Logo (Placeholder)
const Logo3D = ({ position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }) => {
  const groupRef = useRef()
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
        {/* Main T-shape or stylized logo */}
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.5, 0.3, 0.3]} />
          <meshPhysicalMaterial
            color="#88c0d0"
            metalness={0.9}
            roughness={0.1}
            transmission={0.5}
            thickness={0.5}
            envMapIntensity={1}
          />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <boxGeometry args={[0.3, 1.2, 0.3]} />
          <meshPhysicalMaterial
            color="#5e81ac"
            metalness={0.9}
            roughness={0.1}
            transmission={0.5}
            thickness={0.5}
            envMapIntensity={1}
          />
        </mesh>
        {/* Orbiting cube */}
        <mesh position={[0.8, 0.3, 0.5]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshPhysicalMaterial
            color="#b48ead"
            metalness={1}
            roughness={0}
            envMapIntensity={2}
          />
        </mesh>
        {/* Orbiting sphere */}
        <mesh position={[-0.6, -0.5, 0.4]}>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshPhysicalMaterial
            color="#a3be8c"
            metalness={1}
            roughness={0}
            envMapIntensity={2}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Spaceship Component
const Spaceship = ({ position = [5, 0, -5] }) => {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.x = 5 + Math.sin(state.clock.elapsedTime * 0.3) * 2
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.5
      ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={ref} position={position} scale={0.3} rotation={[0, -Math.PI / 4, 0]}>
      {/* Main body */}
      <mesh>
        <coneGeometry args={[0.5, 2, 6]} />
        <meshStandardMaterial color="#2e3440" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Wings */}
      <mesh position={[0.6, -0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1, 0.1, 0.5]} />
        <meshStandardMaterial color="#3b4252" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[-0.6, -0.5, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1, 0.1, 0.5]} />
        <meshStandardMaterial color="#3b4252" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Engine glow */}
      <mesh position={[0, -1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ff6b35" />
      </mesh>
    </group>
  )
}

// Nebula Effect
const Nebula = () => {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z += 0.0002
    }
  })

  return (
    <mesh ref={ref} position={[0, 0, -20]}>
      <planeGeometry args={[60, 60]} />
      <meshBasicMaterial
        color="#1a1a2e"
        transparent
        opacity={0.5}
      />
    </mesh>
  )
}

// Main Scene Content
const SceneContent = ({ scrollProgress = 0 }) => {
  const { camera } = useThree()
  
  useFrame(() => {
    // Subtle camera movement based on scroll
    camera.position.z = 8 - scrollProgress * 2
    camera.position.y = scrollProgress * 1
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#fff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#b48ead" />
      <spotLight
        position={[5, 5, 5]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#ff6b35"
        castShadow
      />
      
      {/* Environment for reflections */}
      <Environment preset="night" />
      
      {/* Stars background */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />
      
      {/* Main planet */}
      <Planet position={[0, 2, -5]} size={3} color="#ff6b35" />
      
      {/* Secondary smaller planets */}
      <Planet position={[-8, -2, -10]} size={1} color="#5e81ac" />
      <Planet position={[10, 4, -15]} size={0.8} color="#b48ead" />
      
      {/* 3D Logo */}
      <Logo3D position={[0, 0, 0]} scale={1.5} />
      
      {/* Orbiting particles */}
      <OrbitingParticles count={800} radius={12} />
      
      {/* Spaceship */}
      <Spaceship position={[5, 0, -5]} />
      
      {/* Nebula backdrop */}
      <Nebula />
    </>
  )
}

// Main SpaceScene Component
const SpaceScene = ({ scrollProgress = 0, className = '' }) => {
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <SceneContent scrollProgress={scrollProgress} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default SpaceScene
