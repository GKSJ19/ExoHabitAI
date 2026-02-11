import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Sparkles as DreiSparkles } from '@react-three/drei'
import * as THREE from 'three'

// Enhanced Black Hole with Accretion Disk and Gravitational Lensing
const BlackHole = ({ mousePosition, scrollY }) => {
  const groupRef = useRef()
  const ringRefs = [useRef(), useRef(), useRef()]
  
  useFrame((state) => {
    if (!groupRef.current) return
    
    const t = state.clock.elapsedTime
    
    // Smooth rotation with mouse influence
    groupRef.current.rotation.y = t * 0.05 + mousePosition.x * 0.2
    groupRef.current.rotation.x = mousePosition.y * 0.15
    
    // Pulsating effect
    const pulse = Math.sin(t * 0.5) * 0.05 + 1
    groupRef.current.scale.setScalar(pulse)
    
    // Animate each ring independently
    ringRefs.forEach((ref, i) => {
      if (ref.current) {
        ref.current.rotation.z = t * (0.3 + i * 0.1) * (i % 2 === 0 ? 1 : -1)
      }
    })
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Core Black Sphere */}
      <mesh>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Event Horizon Glow */}
      <mesh>
        <sphereGeometry args={[1.65, 64, 64]} />
        <meshBasicMaterial 
          color="#8b5cf6" 
          transparent 
          opacity={0.4}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Inner Glow Pulsating */}
      <mesh>
        <sphereGeometry args={[1.8, 64, 64]} />
        <meshBasicMaterial 
          color="#a855f7" 
          transparent 
          opacity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Accretion Disk Rings */}
      {[2.8, 3.5, 4.2].map((radius, i) => (
        <mesh key={i} ref={ringRefs[i]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.15 + i * 0.05, 16, 100]} />
          <meshStandardMaterial
            color={i === 0 ? '#06b6d4' : i === 1 ? '#8b5cf6' : '#6366f1'}
            emissive={i === 0 ? '#06b6d4' : i === 1 ? '#8b5cf6' : '#6366f1'}
            emissiveIntensity={0.8}
            transparent
            opacity={0.7 - i * 0.1}
          />
        </mesh>
      ))}

      {/* Energy Field */}
      <mesh>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#a855f7"
          transparent
          opacity={0.05}
          wireframe
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// Advanced Particle System - Static Geometry with Rotation
const ParticleField = ({ mousePosition }) => {
  const points = useRef()
  const particleCount = 800  // Optimized count
  
  const [positions, colors, sizes] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere
      const radius = 30 + Math.random() * 20
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
      
      // Color variation (purple to cyan)
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.4 + Math.random() * 0.3     // R
        colors[i * 3 + 1] = 0.2 + Math.random() * 0.2 // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B (purple)
      } else {
        colors[i * 3] = 0.1 + Math.random() * 0.2     // R
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.3 // G
        colors[i * 3 + 2] = 0.8 + Math.random() * 0.2 // B (cyan)
      }
      
      sizes[i] = Math.random() * 0.1 + 0.05
    }
    
    return [positions, colors, sizes]
  }, [])

  // Only rotate the entire particle field, don't update individual positions
  useFrame((state) => {
    if (!points.current) return
    const time = state.clock.elapsedTime
    points.current.rotation.y = time * 0.1
    points.current.rotation.z = time * 0.05
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// Floating Planets with Orbits
const FloatingPlanets = () => {
  const planetsRef = useRef()
  
  const planets = useMemo(() => [
    { radius: 0.3, color: '#f97316', distance: 12, speed: 0.5, emissive: '#f97316' },
    { radius: 0.4, color: '#06b6d4', distance: 15, speed: 0.3, emissive: '#06b6d4' },
    { radius: 0.25, color: '#8b5cf6', distance: 18, speed: 0.4, emissive: '#8b5cf6' },
  ], [])

  useFrame((state) => {
    if (!planetsRef.current) return
    const time = state.clock.elapsedTime
    
    planetsRef.current.children.forEach((planet, i) => {
      const angle = time * planets[i].speed
      planet.position.x = Math.cos(angle) * planets[i].distance
      planet.position.z = Math.sin(angle) * planets[i].distance
      planet.rotation.y = time * 0.5
    })
  })

  return (
    <group ref={planetsRef}>
      {planets.map((planet, i) => (
        <mesh key={i}>
          <sphereGeometry args={[planet.radius, 32, 32]} />
          <meshStandardMaterial
            color={planet.color}
            emissive={planet.emissive}
            emissiveIntensity={0.5}
            roughness={0.7}
            metalness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// Nebula Cloud Effect
const NebulaCloud = () => {
  const cloudRef = useRef()
  
  useFrame((state) => {
    if (!cloudRef.current) return
    const time = state.clock.elapsedTime
    cloudRef.current.rotation.y = time * 0.01
    cloudRef.current.rotation.x = Math.sin(time * 0.1) * 0.1
  })

  return (
    <mesh ref={cloudRef} position={[0, 0, -20]}>
      <sphereGeometry args={[25, 32, 32]} />
      <meshBasicMaterial
        color="#4c1d95"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

// Dynamic Camera Controller
const CameraController = ({ scrollY, mousePosition }) => {
  const { camera } = useThree()
  
  useFrame(() => {
    // Smooth camera movement based on scroll
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 15 - scrollY * 0.01, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, scrollY * 0.002, 0.05)
    
    // Mouse parallax
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, mousePosition.x * 2, 0.05)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, mousePosition.y * 1, 0.05)
    
    camera.lookAt(0, 0, 0)
  })
  
  return null
}

// Main Scene Content
const SceneContent = ({ scrollY, mousePosition }) => {
  return (
    <>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#06b6d4" />
      <pointLight position={[0, 0, 15]} intensity={0.6} color="#a855f7" />
        <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
        <directionalLight position={[-5, -5, -5]} intensity={0.8} color="#a855f7" />

      {/* Background Elements */}
      <Stars
        radius={150}
        depth={80}
        count={12000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Test sphere to verify rendering */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
      
      <NebulaCloud />
      
      {/* Sparkles for extra magic */}
      <DreiSparkles
        count={100}
        scale={40}
        size={2}
        speed={0.3}
        opacity={0.5}
        color="#a855f7"
      />
      
      {/* Main Attractions */}
      <BlackHole mousePosition={mousePosition} scrollY={scrollY} />
      <ParticleField mousePosition={mousePosition} />
      <FloatingPlanets />
      
      {/* Camera */}
      <CameraController scrollY={scrollY} mousePosition={mousePosition} />
    </>
  )
}

// Main Component
const AdvancedHeroScene = ({ scrollY = 0, mousePosition = { x: 0, y: 0 } }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-0 overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 20], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          failIfMajorPerformanceCaveat: false,
          preserveDrawingBuffer: false,
          stencil: false,
          precision: "lowp",
          clearColor: 0x000000,
          clearAlpha: 1
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }}
      >
        <color attach="background" args={['#000000']} />
        <Suspense fallback={null}>
          <SceneContent scrollY={scrollY} mousePosition={mousePosition} />
        </Suspense>
      </Canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60 pointer-events-none" />
    </div>
  )
}

export default AdvancedHeroScene
