import React, { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cone, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from './gameStore'

const Explosion: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const particlesRef = React.useRef<THREE.Points>(null!)
  const startTime = React.useRef(Date.now())
  
  const particles = useMemo(() => {
    const count = 30
    const positions = new Float32Array(count * 3)
    const velocities: THREE.Vector3[] = []
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      velocities.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.3
      ))
    }
    
    return { positions, velocities }
  }, [])

  useFrame(() => {
    if (particlesRef.current) {
      const positionArray = particlesRef.current.geometry.attributes.position.array as Float32Array
      const elapsed = (Date.now() - startTime.current) / 1000
      
      for (let i = 0; i < particles.velocities.length; i++) {
        positionArray[i * 3] += particles.velocities[i].x * 0.1
        positionArray[i * 3 + 1] += particles.velocities[i].y * 0.1
        positionArray[i * 3 + 2] += particles.velocities[i].z * 0.1
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  return (
    <group position={[x, y, 0]}>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial 
          color="#FF6B00" 
          size={0.15} 
          transparent 
          opacity={0.8}
        />
      </points>
      <pointLight color="#FF4500" intensity={3} distance={5} />
    </group>
  )
}

const Player: React.FC = () => {
  const { playerX, playerY, activePowerUp, isPlayerExploding, isPlayerVisible } = useGameStore()
  const groupRef = React.useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1
      groupRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 10) * 0.05
    }
  })

  if (!isPlayerVisible && !isPlayerExploding) {
    return null
  }

  return (
    <>
      {isPlayerExploding && (
        <Explosion x={playerX} y={playerY} />
      )}
      
      {isPlayerVisible && (
        <group ref={groupRef} position={[playerX, playerY, 0]}>
          <Cone args={[0.5, 1, 8]} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color="#4CAF50" metalness={0.5} roughness={0.3} />
          </Cone>
          
          <Box args={[0.8, 0.3, 0.3]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#2E7D32" />
          </Box>
          
          <Cone args={[0.2, 0.5, 4]} position={[-0.3, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color="#1B5E20" />
          </Cone>
          <Cone args={[0.2, 0.5, 4]} position={[0.3, -0.4, 0]} rotation={[Math.PI, 0, 0]}>
            <meshStandardMaterial color="#1B5E20" />
          </Cone>
          
          <Sphere args={[0.15]} position={[0, 0.3, 0]}>
            <meshStandardMaterial 
              color={activePowerUp ? '#FFEB3B' : '#81D4FA'} 
              emissive={activePowerUp ? '#FFEB3B' : '#81D4FA'}
              emissiveIntensity={0.5}
            />
          </Sphere>
          
          {activePowerUp === 'missile' && (
            <>
              <Box args={[0.1, 0.3, 0.1]} position={[-0.6, 0, 0]}>
                <meshStandardMaterial color="#FF5722" />
              </Box>
              <Box args={[0.1, 0.3, 0.1]} position={[0.6, 0, 0]}>
                <meshStandardMaterial color="#FF5722" />
              </Box>
            </>
          )}
        </group>
      )}
    </>
  )
}

export default Player
