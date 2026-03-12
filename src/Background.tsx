import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

const Background: React.FC = () => {
  const ref = useRef<THREE.Points>(null!)

  const particles = useMemo(() => {
    const count = 500
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30 - 10
      positions[i * 3 + 2] = -Math.random() * 20
    }
    return positions
  }, [])

  useFrame((state, delta) => {
    if (ref.current) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= delta * 2
        if (positions[i + 1] < -15) {
          positions[i + 1] = 15
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <>
      <Points ref={ref} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>

      {[...Array(10)].map((_, i) => (
        <mesh key={i} position={[-4 + (i * 0.8), 5 - i * 2, -5]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshBasicMaterial color="#1A237E" opacity={0.3} transparent />
        </mesh>
      ))}
    </>
  )
}

export default Background
