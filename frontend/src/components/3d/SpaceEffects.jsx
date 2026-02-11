import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Animated star field background
const AnimatedStars = ({ count = 2000 }) => {
  const points = useRef()
  
  const [positions, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
      sizes[i] = Math.random() * 2
    }
    
    return [positions, sizes]
  }, [count])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y += 0.0001
      points.current.rotation.x += 0.00005
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Shooting stars
const ShootingStars = ({ count = 5 }) => {
  const refs = useRef([])
  
  const stars = useMemo(() => {
    return Array.from({ length: count }, () => ({
      startPos: [
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 30 + 15,
        (Math.random() - 0.5) * 20 - 10
      ],
      speed: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 10
    }))
  }, [count])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (ref) {
        const star = stars[i]
        const t = ((time - star.delay) * star.speed) % 8
        if (t > 0 && t < 2) {
          ref.visible = true
          ref.position.x = star.startPos[0] + t * 15
          ref.position.y = star.startPos[1] - t * 10
          ref.position.z = star.startPos[2]
          ref.material.opacity = 1 - t / 2
        } else {
          ref.visible = false
        }
      }
    })
  })

  return (
    <>
      {stars.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          visible={false}
        >
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffffff" transparent />
        </mesh>
      ))}
    </>
  )
}

// Glowing orbs that float around
const GlowingOrbs = ({ count = 10 }) => {
  const refs = useRef([])
  
  const orbs = useMemo(() => {
    const colors = ['#8b5cf6', '#06b6d4', '#f97316', '#22c55e', '#ec4899']
    return Array.from({ length: count }, () => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15 - 5
      ],
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 0.5 + Math.random() * 1,
      amplitude: 0.5 + Math.random() * 1
    }))
  }, [count])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    refs.current.forEach((ref, i) => {
      if (ref) {
        const orb = orbs[i]
        ref.position.y = orb.position[1] + Math.sin(time * orb.speed) * orb.amplitude
        ref.position.x = orb.position[0] + Math.cos(time * orb.speed * 0.5) * orb.amplitude * 0.5
      }
    })
  })

  return (
    <>
      {orbs.map((orb, i) => (
        <mesh
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={orb.position}
        >
          <sphereGeometry args={[0.1 + Math.random() * 0.15, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  )
}

// Orbital rings around the scene
const OrbitalRings = () => {
  const ring1 = useRef()
  const ring2 = useRef()
  const ring3 = useRef()

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (ring1.current) ring1.current.rotation.z = time * 0.1
    if (ring2.current) ring2.current.rotation.z = -time * 0.08
    if (ring3.current) ring3.current.rotation.z = time * 0.05
  })

  return (
    <group position={[0, 0, -10]}>
      <mesh ref={ring1} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[15, 0.02, 16, 100]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2.5, 0.3, 0]}>
        <torusGeometry args={[18, 0.015, 16, 100]} />
        <meshBasicMaterial color="#f97316" transparent opacity={0.2} />
      </mesh>
      <mesh ref={ring3} rotation={[Math.PI / 4, -0.2, 0]}>
        <torusGeometry args={[22, 0.01, 16, 100]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export { AnimatedStars, ShootingStars, GlowingOrbs, OrbitalRings }
