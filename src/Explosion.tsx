import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ExplosionProps {
  position: [number, number, number]
  onComplete: () => void
}

const Explosion: React.FC<ExplosionProps> = ({ position, onComplete }) => {
  const particlesRef = useRef<THREE.Group>(null!)
  const startTimeRef = useRef(Date.now())

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 500)
    return () => clearTimeout(timer)
  }, [onComplete])

  useFrame(() => {
    if (particlesRef.current) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      particlesRef.current.children.forEach((particle, i) => {
        const mesh = particle as THREE.Mesh
        const speed = 2 + (i % 3)
        const angle = (i / 8) * Math.PI * 2
        mesh.position.x = Math.cos(angle) * speed * elapsed
        mesh.position.y = Math.sin(angle) * speed * elapsed
        mesh.scale.setScalar(1 - elapsed * 2)
      })
    }
  })

  return (
    <group ref={particlesRef} position={position}>
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.15, 4, 4]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#FF5722' : '#FFEB3B'} />
        </mesh>
      ))}
    </group>
  )
}

export default Explosion
