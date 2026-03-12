import React from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import GameScene from './GameScene'
import GameUI from './GameUI'

const Game: React.FC = () => {
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
          position={[0, 0, 10]} 
          fov={60}
        />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} />
        <GameScene />
      </Canvas>
      <GameUI />
    </div>
  )
}

export default Game
