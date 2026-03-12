import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import * as THREE from 'three'

interface ExplosionProps {
  position: [number, number, number]
  onComplete?: () => void
}

const Explosion: React.FC<ExplosionProps> = ({ position, onComplete }) => {
  const groupRef = useRef<THREE.Group>(null!)
  const [particles] = useState(() => Array.from({ length: 20 }, () => ({
    speed: Math.random() * 0.1 + 0.05,
    direction: new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ).normalize(),
    size: Math.random() * 0.2 + 0.1,
    color: Math.random() > 0.5 ? '#FF5722' : Math.random() > 0.5 ? '#FF9800' : '#FFEB3B'
  })))

  const startTime = useRef(Date.now())

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete()
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  useFrame(() => {
    const elapsed = Date.now() - startTime.current
    const scale = 1 + (elapsed / 800) * 2
    const alpha = Math.max(0, 1 - elapsed / 800)
    
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const particle = particles[i]
        if (particle && child instanceof THREE.Mesh) {
          child.position.x += particle.direction.x * particle.speed
          child.position.y += particle.direction.y * particle.speed
          child.position.z += particle.direction.z * particle.speed
          child.scale.setScalar(scale * 0.5)
          const mat = child.material as THREE.MeshStandardMaterial
          if (mat.opacity !== undefined) {
            mat.opacity = alpha
          }
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {particles.map((particle, i) => (
        <Sphere key={i} args={[particle.size]}>
          <meshStandardMaterial 
            color={particle.color} 
            emissive={particle.color}
            emissiveIntensity={0.8}
            transparent={true}
          />
        </Sphere>
      ))}
    </group>
  )
}

export default Explosion
