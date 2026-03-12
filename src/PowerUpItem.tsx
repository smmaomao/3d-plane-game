import React from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Torus, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { PowerUp as PowerUpType } from './gameStore'

interface PowerUpItemProps {
  powerUp: PowerUpType
}

const PowerUpItem: React.FC<PowerUpItemProps> = ({ powerUp }) => {
  const groupRef = React.useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.03
      groupRef.current.position.y = powerUp.y + Math.sin(state.clock.elapsedTime * 2) * 0.2
    }
  })

  const getPowerUpModel = () => {
    switch (powerUp.type) {
      case 'spread':
        return (
          <>
            <Sphere args={[0.3]}>
              <meshStandardMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={0.5} />
            </Sphere>
            <Cylinder args={[0.05, 0.05, 0.6]} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
              <meshStandardMaterial color="#FFC107" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.6]} position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
              <meshStandardMaterial color="#FFC107" />
            </Cylinder>
            <pointLight color="#FF9800" intensity={0.8} distance={3} />
          </>
        )
      case 'missile':
        return (
          <>
            <Box args={[0.3, 0.5, 0.3]}>
              <meshStandardMaterial color="#F44336" metalness={0.5} />
            </Box>
            <Sphere args={[0.15]} position={[0, 0.3, 0]}>
              <meshStandardMaterial color="#FF5722" />
            </Sphere>
            <pointLight color="#F44336" intensity={0.8} distance={3} />
          </>
        )
      case 'laser':
        return (
          <>
            <Torus args={[0.25, 0.08, 8, 8]}>
              <meshStandardMaterial color="#9C27B0" emissive="#9C27B0" emissiveIntensity={0.5} />
            </Torus>
            <Cylinder args={[0.05, 0.05, 0.8]} position={[0, 0, 0]}>
              <meshStandardMaterial color="#E1BEE7" />
            </Cylinder>
            <pointLight color="#9C27B0" intensity={0.8} distance={3} />
          </>
        )
      default:
        return null
    }
  }

  return (
    <group ref={groupRef} position={[powerUp.x, powerUp.y, 0]}>
      {getPowerUpModel()}
    </group>
  )
}

export default PowerUpItem
