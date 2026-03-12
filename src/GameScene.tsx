import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
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
    updateBullets, 
    updateEnemies, 
    updatePowerUps,
    updateTime,
    spawnEnemy,
    bossActive
  } = useGameStore()
  
  const lastSpawnRef = useRef(0)
  const lastShootRef = useRef(0)

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

  useFrame((_, delta) => {
    if (gameState !== 'playing') return

    updateBullets(delta)
    updateEnemies(delta)
    updatePowerUps(delta)
    updateTime(delta)

    const { enemies, playerX, playerY, damagePlayer, isPlayerInvincible, isPlayerExploding } = useGameStore.getState()
    if (!isPlayerInvincible && !isPlayerExploding) {
      enemies.forEach(enemy => {
        const dx = enemy.x - playerX
        const dy = enemy.y - playerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 1.2) {
          damagePlayer()
        }
      })
    }

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

  const { enemies, bullets, powerUps, explosionPosition, isPlayerExploding, completePlayerExplosion, resetPlayerPosition } = useGameStore()

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
      
      {!isPlayerExploding && <Player />}
      
      {explosionPosition && (
        <Explosion 
          position={explosionPosition} 
          onComplete={() => {
            if (useGameStore.getState().playerHealth > 0) {
              resetPlayerPosition()
            }
            completePlayerExplosion()
          }} 
        />
      )}
    </>
  )
}

export default GameScene
