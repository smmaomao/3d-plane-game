import React from 'react'
import { Box, Cone, Sphere, Cylinder } from '@react-three/drei'
import * as THREE from 'three'
import { Enemy as EnemyType } from './gameStore'

interface EnemyProps {
  enemy: EnemyType
}

const Enemy: React.FC<EnemyProps> = ({ enemy }) => {
  const groupRef = React.useRef<THREE.Group>(null!)

  React.useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI
    }
  }, [])

  if (enemy.type === 'boss') {
    return (
      <group ref={groupRef} position={[enemy.x, enemy.y, 0]}>
        <Cylinder args={[2, 3, 4, 8]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#D32F2F" metalness={0.6} roughness={0.4} />
        </Cylinder>
        
        <Cone args={[1.5, 2, 8]} position={[0, 2, 0]}>
          <meshStandardMaterial color="#B71C1C" />
        </Cone>
        
        <Sphere args={[0.5]} position={[-1, 1, 1]}>
          <meshStandardMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={0.5} />
        </Sphere>
        <Sphere args={[0.5]} position={[1, 1, 1]}>
          <meshStandardMaterial color="#FF9800" emissive="#FF9800" emissiveIntensity={0.5} />
        </Sphere>
        
        <Box args={[0.5, 0.5, 0.5]} position={[-2, 0, 0]}>
          <meshStandardMaterial color="#7B1FA2" />
        </Box>
        <Box args={[0.5, 0.5, 0.5]} position={[2, 0, 0]}>
          <meshStandardMaterial color="#7B1FA2" />
        </Box>
        
        <Box args={[3, 0.3, 0.3]} position={[0, -1, 0]}>
          <meshStandardMaterial color="#880E4F" />
        </Box>
      </group>
    )
  }

  if (enemy.type === 'medium') {
    return (
      <group ref={groupRef} position={[enemy.x, enemy.y, 0]}>
        <Cone args={[0.8, 1.2, 6]}>
          <meshStandardMaterial color="#FF5722" metalness={0.4} />
        </Cone>
        <Box args={[1, 0.4, 0.4]} position={[0, -0.3, 0]}>
          <meshStandardMaterial color="#E64A19" />
        </Box>
        <Sphere args={[0.2]} position={[0, 0.4, 0]}>
          <meshStandardMaterial color="#FFC107" emissive="#FFC107" />
        </Sphere>
      </group>
    )
  }

  return (
    <group ref={groupRef} position={[enemy.x, enemy.y, 0]}>
      <Cone args={[0.5, 0.8, 4]}>
        <meshStandardMaterial color="#FF9800" />
      </Cone>
      <Sphere args={[0.15]} position={[0, 0.3, 0]}>
        <meshStandardMaterial color="#FF5252" emissive="#FF5252" />
      </Sphere>
    </group>
  )
}

export default Enemy
