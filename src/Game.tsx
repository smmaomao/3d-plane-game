import React, { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, Environment } from '@react-three/drei'
import GameScene from './GameScene'
import GameUI from './GameUI'
import { useGameStore } from './gameStore'

const Game: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < window.innerHeight)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ 
      width: '100vw', 
      height: '100vh',
      background: '#000',
      position: 'relative'
    }}>
      <Canvas>
        <PerspectiveCamera 
          makeDefault 
          position={[0, -3, 15]} 
          fov={60}
        />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, -7, 5]} intensity={1} color="#4CAF50" />
        <Environment preset="night" />
        <GameScene />
      </Canvas>
      <GameUI />
    </div>
  )
}

export default Game
