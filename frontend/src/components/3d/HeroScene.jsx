import { useRef, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, Environment, Text3D, Center, MeshDistortMaterial, Sphere } from '@react-three/drei'
import gsap from 'gsap'
import * as THREE from 'three'

// Camera controller for smooth scroll-based movement and mouse parallax
const CameraController = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const { camera } = useThree()
  
  useFrame(() => {
    const scrollProgress = Math.min(scrollY / 1000, 1)
    camera.position.z = 8 - scrollProgress * 2
    camera.position.y = scrollProgress * 3 + mousePosition.y * 0.5
    camera.position.x = mousePosition.x * 0.5
    camera.rotation.x = -scrollProgress * 0.3 - mousePosition.y * 0.05
    camera.rotation.y = mousePosition.x * 0.05
    camera.lookAt(0, scrollProgress * 2, -5)
  })
  
  return null
}

// Black Hole with Event Horizon and Accretion Disk
const BlackHole = ({ scrollY = 0 }) => {
  const coreRef = useRef()
  const eventHorizonRef = useRef()
  const accretionDiskRef = useRef()
  const innerGlowRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    const scrollProgress = Math.min(scrollY / 1000, 1)
    
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.001
      coreRef.current.position.y = 0 + scrollProgress * 4
      coreRef.current.position.z = -5 - scrollProgress * 6
      coreRef.current.scale.setScalar(1 - scrollProgress * 0.4)
    }
    
    if (eventHorizonRef.current) {
      eventHorizonRef.current.rotation.y -= 0.003
      eventHorizonRef.current.rotation.x = Math.sin(time * 0.5) * 0.1
    }
    
    if (accretionDiskRef.current) {
      accretionDiskRef.current.rotation.z += 0.008
    }
    
    if (innerGlowRef.current) {
      innerGlowRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
      innerGlowRef.current.material.opacity = 0.3 + Math.sin(time * 1.5) * 0.15
    }
  })

  return (
    <group>
      {/* Event Horizon - Dark core */}
      <mesh ref={coreRef} position={[0, 0, -5]}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial
          color="#000000"
          transparent
          opacity={0.95}
        />
      </mesh>
      
      {/* Gravitational Lensing Effect */}
      <mesh ref={eventHorizonRef} position={[0, 0, -5]} scale={1.3}>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial
          color="#1a0033"
          transparent
          opacity={0.4}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Inner glow - subtle purple */}
      <mesh ref={innerGlowRef} position={[0, 0, -5]} scale={1.5}>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshBasicMaterial
          color="#6b21a8"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Accretion Disk */}
      <group ref={accretionDiskRef} position={[0, 0, -5]} rotation={[Math.PI / 2.5, 0, 0]}>
        {/* Inner disk - bright cyan */}
        <mesh>
          <torusGeometry args={[3, 0.3, 2, 100]} />
          <meshStandardMaterial
            color="#06b6d4"
            emissive="#06b6d4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Middle disk - purple */}
        <mesh>
          <torusGeometry args={[3.8, 0.25, 2, 100]} />
          <meshStandardMaterial
            color="#8b5cf6"
            emissive="#8b5cf6"
            emissiveIntensity={0.4}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Outer disk - faint */}
        <mesh>
          <torusGeometry args={[4.5, 0.15, 2, 100]} />
          <meshStandardMaterial
            color="#a78bfa"
            emissive="#a78bfa"
            emissiveIntensity={0.2}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  )
}

// Keep for compatibility - now redirects to BlackHole
const HeroExoplanet = (props) => <BlackHole {...props} />

// Animated ExoHabit Logo
const ExoHabitLogo = ({ position = [0, 0, 0], scale = 1 }) => {
  const groupRef = useRef()
  const cubeRef = useRef()
  const sphereRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.2
      groupRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.15
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x = time * 0.5
      cubeRef.current.rotation.y = time * 0.3
      cubeRef.current.position.x = 0.9 + Math.sin(time) * 0.1
      cubeRef.current.position.y = 0.3 + Math.cos(time * 1.5) * 0.1
    }
    if (sphereRef.current) {
      sphereRef.current.position.x = -0.7 + Math.cos(time * 0.8) * 0.1
      sphereRef.current.position.y = -0.6 + Math.sin(time * 0.8) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group ref={groupRef} position={position} scale={scale}>
        {/* E shape - stylized */}
        <mesh position={[-0.6, 0, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.35, 0.52, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.15]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.35, 0, 0]}>
          <boxGeometry args={[0.4, 0.12, 0.15]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh position={[-0.35, -0.52, 0]}>
          <boxGeometry args={[0.5, 0.12, 0.15]} />
          <meshPhysicalMaterial
            color="#60a5fa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* X shape */}
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.12, 1.0, 0.15]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        <mesh position={[0.3, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[0.12, 1.0, 0.15]} />
          <meshPhysicalMaterial
            color="#a78bfa"
            metalness={0.95}
            roughness={0.05}
            envMapIntensity={1.5}
          />
        </mesh>
        
        {/* Orbiting cube */}
        <mesh ref={cubeRef} position={[0.9, 0.3, 0.3]} scale={0.18}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color="#f472b6"
            metalness={1}
            roughness={0}
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Orbiting sphere */}
        <mesh ref={sphereRef} position={[-0.7, -0.6, 0.3]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshPhysicalMaterial
            color="#34d399"
            metalness={1}
            roughness={0}
            envMapIntensity={2}
          />
        </mesh>
      </group>
    </Float>
  )
}

// Optimized particle field with dark theme colors
const ParticleField = ({ count = 800 }) => {
  const points = useRef()
  
  const particles = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  
  for (let i = 0; i < count; i++) {
    particles[i * 3] = (Math.random() - 0.5) * 40
    particles[i * 3 + 1] = (Math.random() - 0.5) * 40
    particles[i * 3 + 2] = (Math.random() - 0.5) * 40
    
    const colorChoice = Math.random()
    if (colorChoice < 0.4) {
      colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 0.6 // Dark Purple
    } else if (colorChoice < 0.7) {
      colors[i * 3] = 0.1; colors[i * 3 + 1] = 0.5; colors[i * 3 + 2] = 0.7 // Dark Cyan
    } else {
      colors[i * 3] = 0.5; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.7 // Violet
    }
  }

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0002
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1
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
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.4}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// Scene content with enhanced dark lighting
const HeroSceneContent = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  const { camera } = useThree()
  
  return (
    <>
      <CameraController scrollY={scrollY} mousePosition={mousePosition} />
      <ambientLight intensity={0.15} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#4c1d95" />
      <pointLight position={[-10, 5, -10]} intensity={0.8} color="#6b21a8" />
      <pointLight position={[0, -5, 5]} intensity={0.4} color="#06b6d4" />
      <pointLight position={[0, 0, 10]} intensity={0.3} color="#1e1b4b" />
      <spotLight
        position={[0, 15, 0]}
        angle={0.4}
        penumbra={1}
        intensity={0.8}
        castShadow
        color="#8b5cf6"
      />
      
      <Environment preset="night" />
      
      <Stars
        radius={100}
        depth={80}
        count={8000}
        factor={6}
        saturation={0}
        fade
        speed={0.3}
      />
      
      <BlackHole scrollY={scrollY} />
      <ExoHabitLogo position={[0, -0.5, 2]} scale={1.2} />
      <ParticleField count={1500} />
    </>
  )
}

// Main Hero Scene
const HeroScene = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  return (
    <div className="fixed inset-0" style={{ zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <HeroSceneContent scrollY={scrollY} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default HeroScene
