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
      {/* 飞机机身 - 主体 */}
      <Cone args={[0.8, 2, 8]} position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
        <meshStandardMaterial color="#00FF00" metalness={0.3} roughness={0.4} emissive="#00AA00" emissiveIntensity={0.2} />
      </Cone>

      {/* 飞机翅膀 - 主机翼 */}
      <Box args={[2.5, 0.5, 0.4]} position={[0, -0.3, 0]}>
        <meshStandardMaterial color="#00CC00" />
      </Box>

      {/* 左翼 */}
      <Cone args={[0.4, 1, 4]} position={[-1, -0.5, 0]} rotation={[Math.PI, 0, -0.3]}>
        <meshStandardMaterial color="#009900" />
      </Cone>
      {/* 右翼 */}
      <Cone args={[0.4, 1, 4]} position={[1, -0.5, 0]} rotation={[Math.PI, 0, 0.3]}>
        <meshStandardMaterial color="#009900" />
      </Cone>

      {/* 尾翼 */}
      <Box args={[1, 0.3, 0.2]} position={[0, -1.2, 0]}>
        <meshStandardMaterial color="#008800" />
      </Box>

      {/* 驾驶舱 */}
      <Sphere args={[0.35]} position={[0, 0.5, 0]}>
        <meshStandardMaterial
          color={activePowerUp ? '#FFFF00' : '#00FFFF'}
          emissive={activePowerUp ? '#FFFF00' : '#00FFFF'}
          emissiveIntensity={0.6}
        />
      </Sphere>

      {/* 引擎发光效果 */}
      <Sphere args={[0.2]} position={[-0.6, -0.8, 0]}>
        <meshBasicMaterial color="#FF6600" />
      </Sphere>
      <Sphere args={[0.2]} position={[0.6, -0.8, 0]}>
        <meshBasicMaterial color="#FF6600" />
      </Sphere>

      {activePowerUp === 'missile' && (
        <>
          <Box args={[0.2, 0.6, 0.2]} position={[-1.2, 0, 0]}>
            <meshStandardMaterial color="#FF5722" />
          </Box>
          <Box args={[0.2, 0.6, 0.2]} position={[1.2, 0, 0]}>
            <meshStandardMaterial color="#FF5722" />
          </Box>
        </>
      )}
    </group>
  )
}

export default Player
