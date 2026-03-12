import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Box, Cylinder, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'
import Player from './Player'
import Enemy from './Enemy'
import Bullet from './Bullet'
import PowerUpItem from './PowerUpItem'
import Background from './Background'
import Explosion from './Explosion'
import { useGameStore } from './gameStore'

const GameScene: React.FC = () => {
  const {
    gameState,
    level,
    updateBullets,
    updateEnemies,
    updatePowerUps,
    updateTime,
    spawnEnemy,
    bossActive,
    timeRemaining,
    playerX,
    playerY,
    isPlayerExploding,
    respawnPlayer,
    gameState: currentGameState
  } = useGameStore()

  const lastSpawnRef = useRef(0)
  const lastShootRef = useRef(0)
  const explosionHandledRef = useRef(false)

  useEffect(() => {
    if (gameState !== 'playing') return

    const handleKeyDown = (e: KeyboardEvent) => {
      const { movePlayer, shoot } = useGameStore.getState()
      switch (e.key) {
        case 'ArrowLeft': movePlayer(-0.2, 0); break
        case 'ArrowRight': movePlayer(0.2, 0); break
        case 'ArrowUp': movePlayer(0, 0.2); break
        case 'ArrowDown': movePlayer(0, -0.2); break
        case ' ': shoot(); break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState])

  useFrame((state, delta) => {
    if (gameState !== 'playing') return

    updateBullets(delta)
    updateEnemies(delta)
    updatePowerUps(delta)
    updateTime(delta)

    const now = Date.now()
    if (now - lastSpawnRef.current > 2000 && !bossActive) {
      const enemyType = Math.random() > 0.7 ? 'medium' : 'small'
      spawnEnemy(enemyType)
      lastSpawnRef.current = now
    }

    if (now - lastShootRef.current > 500) {
      const { enemies, enemyShoot } = useGameStore.getState()
      enemies.forEach(enemy => {
        if (Math.random() > 0.8) enemyShoot(enemy.id)
      })
      lastShootRef.current = now
    }
  })

  const { enemies, bullets, powerUps, isPlayerInvincible } = useGameStore()

  const handleExplosionComplete = () => {
    if (currentGameState !== 'gameOver') {
      respawnPlayer()
    }
    explosionHandledRef.current = false
  }

  return (
    <>
      <Background />

      {enemies.map(enemy => (
        <Enemy key={enemy.id} enemy={enemy} />
      ))}

      {bullets.map(bullet => (
        <Bullet key={bullet.id} bullet={bullet} />
      ))}

      {powerUps.map(powerUp => (
        <PowerUpItem key={powerUp.id} powerUp={powerUp} />
      ))}

      {isPlayerExploding && (
        <Explosion
          position={[playerX, playerY, 0]}
          onComplete={handleExplosionComplete}
        />
      )}

      {!isPlayerExploding && <Player />}
    </>
  )
}

export default GameScene
