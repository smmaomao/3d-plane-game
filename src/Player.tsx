import React from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Cone, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from './gameStore'

const Player: React.FC = () => {
  const { playerX, playerY, activePowerUp } = useGameStore()
  const groupRef = React.useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1
      groupRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 10) * 0.05
    }
  })

  return (
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
  )
}

export default Player
