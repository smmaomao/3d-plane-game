import React from 'react'
import { Sphere, Box } from '@react-three/drei'
import { Bullet as BulletType } from './gameStore'

interface BulletProps {
  bullet: BulletType
}

const Bullet: React.FC<BulletProps> = ({ bullet }) => {
  if (bullet.isPlayer) {
    return (
      <group position={[bullet.x, bullet.y, 0]}>
        <Sphere args={[0.1]}>
          <meshStandardMaterial 
            color="#81D4FA" 
            emissive="#2196F3" 
            emissiveIntensity={1} 
          />
        </Sphere>
        <pointLight color="#2196F3" intensity={0.5} distance={2} />
      </group>
    )
  }

  return (
    <group position={[bullet.x, bullet.y, 0]}>
      <Box args={[0.1, 0.2, 0.1]}>
        <meshStandardMaterial 
          color="#FF8A80" 
          emissive="#F44336" 
          emissiveIntensity={0.8} 
        />
      </Box>
      <pointLight color="#F44336" intensity={0.5} distance={2} />
    </group>
  )
}

export default Bullet
