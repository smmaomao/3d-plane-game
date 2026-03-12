import React from 'react'
import { useFrame } from '@react-three/fiber'
import { Box, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { useGameStore } from './gameStore'

const Player: React.FC = () => {
  const { playerX, playerY, activePowerUp, isPlayerInvincible } = useGameStore()
  const groupRef = React.useRef<THREE.Group>(null!)
  const [isVisible, setIsVisible] = React.useState(true)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 5) * 0.1
      groupRef.current.rotation.z = -Math.sin(state.clock.elapsedTime * 10) * 0.05
    }
    if (isPlayerInvincible) {
      setIsVisible(Math.sin(state.clock.elapsedTime * 20) > 0)
    } else if (!isVisible) {
      setIsVisible(true)
    }
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={[playerX, playerY, 0]}>
      <Cylinder args={[0.1, 0.3, 1.2, 8]} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#4CAF50" metalness={0.5} roughness={0.3} />
      </Cylinder>

      <Box args={[0.8, 0.1, 0.6]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </Box>

      <Box args={[1.2, 0.05, 0.2]} position={[0, -0.2, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Box>

      <Box args={[0.1, 0.05, 0.8]} position={[0, -0.2, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Box>

      <Box args={[0.4, 0.05, 0.6]} position={[0, -0.5, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Box>

      <Box args={[0.3, 0.05, 0.05]} position={[-0.6, 0, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Box>
      <Box args={[0.3, 0.05, 0.05]} position={[0.6, 0, 0]}>
        <meshStandardMaterial color="#1B5E20" />
      </Box>

      <Box args={[0.1, 0.3, 0.1]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="#2E7D32" />
      </Box>

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
