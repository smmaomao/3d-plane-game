import { create } from 'zustand'

export type PowerUpType = 'spread' | 'missile' | 'laser' | null

export interface Enemy {
  id: string
  x: number
  y: number
  health: number
  type: 'small' | 'medium' | 'boss'
}

export interface Bullet {
  id: string
  x: number
  y: number
  isPlayer: boolean
  speed: number
}

export interface PowerUp {
  id: string
  x: number
  y: number
  type: PowerUpType
}

interface GameState {
  playerX: number
  playerY: number
  playerHealth: number
  score: number
  level: number
  gameState: 'menu' | 'playing' | 'gameOver' | 'levelComplete'
  enemies: Enemy[]
  bullets: Bullet[]
  powerUps: PowerUp[]
  activePowerUp: PowerUpType
  powerUpEndTime: number
  timeRemaining: number
  bossActive: boolean
  isPlayerInvincible: boolean
  isPlayerExploding: boolean
  playerRespawnTime: number

  movePlayer: (x: number, y: number) => void
  shoot: () => void
  enemyShoot: (enemyId: string) => void
  updateBullets: (delta: number) => void
  updateEnemies: (delta: number) => void
  spawnEnemy: (type: 'small' | 'medium' | 'boss') => void
  spawnPowerUp: (type: PowerUpType, x: number, y: number) => void
  activatePowerUp: (type: PowerUpType) => void
  updatePowerUps: (delta: number) => void
  damagePlayer: () => void
  damageEnemy: (id: string, amount: number) => void
  startGame: () => void
  nextLevel: () => void
  updateTime: (delta: number) => void
  resetGame: () => void
  respawnPlayer: () => void
  setPlayerExploding: (exploding: boolean) => void
}

export const useGameStore = create<GameState>((set, get) => ({
  playerX: 0,
  playerY: -8,
  playerHealth: 3,
  score: 0,
  level: 1,
  gameState: 'menu',
  enemies: [],
  bullets: [],
  powerUps: [],
  activePowerUp: null,
  powerUpEndTime: 0,
  timeRemaining: 60,
  bossActive: false,
  isPlayerInvincible: false,
  isPlayerExploding: false,
  playerRespawnTime: 0,

  movePlayer: (x, y) => set(state => ({
    playerX: Math.max(-4, Math.min(4, state.playerX + x)),
    playerY: Math.max(-9, Math.min(0, state.playerY + y))
  })),

  shoot: () => {
    const { playerX, playerY, activePowerUp, bullets } = get()
    const newBullets = [...bullets]
    const baseId = Date.now().toString()

    if (activePowerUp === 'spread') {
      newBullets.push(
        { id: `${baseId}-1`, x: playerX, y: playerY + 0.5, isPlayer: true, speed: 0.3 },
        { id: `${baseId}-2`, x: playerX - 0.3, y: playerY + 0.5, isPlayer: true, speed: 0.3 },
        { id: `${baseId}-3`, x: playerX + 0.3, y: playerY + 0.5, isPlayer: true, speed: 0.3 }
      )
    } else if (activePowerUp === 'missile') {
      newBullets.push(
        { id: `${baseId}-m1`, x: playerX - 0.5, y: playerY + 0.5, isPlayer: true, speed: 0.4 },
        { id: `${baseId}-m2`, x: playerX + 0.5, y: playerY + 0.5, isPlayer: true, speed: 0.4 }
      )
    } else if (activePowerUp === 'laser') {
      for (let i = 0; i < 5; i++) {
        newBullets.push({
          id: `${baseId}-l${i}`,
          x: playerX - 1 + (i * 0.5),
          y: playerY + 0.5,
          isPlayer: true,
          speed: 0.5
        })
      }
    } else {
      newBullets.push({ id: baseId, x: playerX, y: playerY + 0.5, isPlayer: true, speed: 0.3 })
    }

    set({ bullets: newBullets })
  },

  enemyShoot: (enemyId) => {
    const enemy = get().enemies.find(e => e.id === enemyId)
    if (enemy) {
      set(state => ({
        bullets: [...state.bullets, {
          id: `enemy-${Date.now()}-${Math.random()}`,
          x: enemy.x,
          y: enemy.y - 0.5,
          isPlayer: false,
          speed: 0.15
        }]
      }))
    }
  },

  updateBullets: (delta) => {
    const { bullets, enemies, playerX, playerY, damageEnemy, damagePlayer } = get()
    const updatedBullets = bullets
      .map(b => ({
        ...b,
        y: b.y + (b.isPlayer ? b.speed : -b.speed)
      }))
      .filter(b => b.y > -10 && b.y < 10)

    const bulletsToRemove = new Set<string>()

    updatedBullets.forEach(bullet => {
      if (bullet.isPlayer) {
        enemies.forEach(enemy => {
          const dx = bullet.x - enemy.x
          const dy = bullet.y - enemy.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 0.8) {
            bulletsToRemove.add(bullet.id)
            damageEnemy(enemy.id, 1)
          }
        })
      } else {
        const dx = bullet.x - playerX
        const dy = bullet.y - playerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < 0.8) {
          bulletsToRemove.add(bullet.id)
          damagePlayer()
        }
      }
    })

    set({
      bullets: updatedBullets.filter(b => !bulletsToRemove.has(b.id))
    })
  },

  updateEnemies: (delta) => {
    const { enemies, playerX, playerY, damagePlayer, isPlayerInvincible, isPlayerExploding } = get()
    const updatedEnemies = enemies.map(e => {
      let newY = e.y
      let newX = e.x

      if (e.type === 'small') {
        newY -= 0.05
      } else if (e.type === 'medium') {
        newY -= 0.03
        newX += Math.sin(Date.now() * 0.005) * 0.02
      } else if (e.type === 'boss') {
        newX = 3 * Math.sin(Date.now() * 0.001)
      }

      return { ...e, x: newX, y: newY }
    }).filter(e => {
      if (e.y <= -10) return false
      
      if (!isPlayerInvincible && !isPlayerExploding) {
        const dx = e.x - playerX
        const dy = e.y - playerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const collisionDistance = e.type === 'boss' ? 2.5 : e.type === 'medium' ? 1 : 0.8
        if (distance < collisionDistance) {
          damagePlayer()
          return false
        }
      }
      
      return true
    })

    set({ enemies: updatedEnemies })
  },

  spawnEnemy: (type) => {
    const { enemies } = get()
    if (type === 'boss' && get().bossActive) return

    const newEnemy = {
      id: `enemy-${Date.now()}-${Math.random()}`,
      x: Math.random() * 8 - 4,
      y: 10,
      health: type === 'small' ? 1 : type === 'medium' ? 3 : 20,
      type
    }

    if (type === 'boss') {
      newEnemy.x = 0
      newEnemy.y = 5
      set({ bossActive: true })
    }

    set({ enemies: [...enemies, newEnemy] })
  },

  spawnPowerUp: (type, x, y) => {
    set(state => ({
      powerUps: [...state.powerUps, {
        id: `powerup-${Date.now()}-${Math.random()}`,
        x,
        y,
        type
      }]
    }))
  },

  activatePowerUp: (type) => {
    if (!type) return
    set({
      activePowerUp: type,
      powerUpEndTime: Date.now() + 5000
    })
  },

  updatePowerUps: (delta) => {
    const { powerUps, playerX, playerY, activatePowerUp, activePowerUp, powerUpEndTime } = get()
    
    if (activePowerUp && Date.now() > powerUpEndTime) {
      set({ activePowerUp: null })
    }

    const powerUpsToRemove = new Set<string>()
    const updatedPowerUps = powerUps.map(p => ({ ...p, y: p.y - 0.05 }))

    updatedPowerUps.forEach(powerUp => {
      const dx = powerUp.x - playerX
      const dy = powerUp.y - playerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance < 1) {
        powerUpsToRemove.add(powerUp.id)
        activatePowerUp(powerUp.type)
      }
    })

    set({
      powerUps: updatedPowerUps.filter(p => p.y > -10 && !powerUpsToRemove.has(p.id))
    })
  },

  damagePlayer: () => {
    const { isPlayerInvincible, isPlayerExploding, playerHealth } = get()
    if (isPlayerInvincible || isPlayerExploding) return

    const newHealth = playerHealth - 1
    if (newHealth <= 0) {
      set({ playerHealth: 0, gameState: 'gameOver', isPlayerExploding: true })
    } else {
      set({ 
        playerHealth: newHealth, 
        isPlayerExploding: true,
        isPlayerInvincible: true 
      })
    }
  },

  setPlayerExploding: (exploding: boolean) => {
    set({ isPlayerExploding: exploding })
  },

  respawnPlayer: () => {
    set({ 
      playerX: 0,
      playerY: -8,
      isPlayerExploding: false,
      isPlayerInvincible: true,
      playerRespawnTime: Date.now() + 2000
    })
    setTimeout(() => {
      set({ isPlayerInvincible: false })
    }, 2000)
  },

  damageEnemy: (id, amount) => {
    const { enemies, spawnPowerUp, score } = get()
    const enemy = enemies.find(e => e.id === id)
    if (!enemy) return

    const newHealth = enemy.health - amount
    let newEnemies = [...enemies]

    if (newHealth <= 0) {
      newEnemies = enemies.filter(e => e.id !== id)
      const points = enemy.type === 'small' ? 100 : enemy.type === 'medium' ? 300 : 1000
      
      if (Math.random() > 0.7) {
        const powerTypes: PowerUpType[] = ['spread', 'missile', 'laser']
        const randomType = powerTypes[Math.floor(Math.random() * 3)]
        spawnPowerUp(randomType, enemy.x, enemy.y)
      }

      if (enemy.type === 'boss') {
        set({ 
          gameState: 'levelComplete',
          bossActive: false,
          score: score + points,
          enemies: newEnemies
        })
        return
      }

      set({ 
        enemies: newEnemies,
        score: score + points
      })
    } else {
      newEnemies = enemies.map(e => 
        e.id === id ? { ...e, health: newHealth } : e
      )
      set({ enemies: newEnemies })
    }
  },

  startGame: () => set({
    gameState: 'playing',
    playerHealth: 3,
    score: 0,
    level: 1,
    timeRemaining: 60,
    bossActive: false,
    enemies: [],
    bullets: [],
    powerUps: [],
    activePowerUp: null,
    isPlayerInvincible: false,
    isPlayerExploding: false,
    playerRespawnTime: 0,
    playerX: 0,
    playerY: -8
  }),

  nextLevel: () => set(state => ({
    level: state.level + 1,
    timeRemaining: 60,
    bossActive: false,
    enemies: [],
    bullets: [],
    powerUps: [],
    activePowerUp: null,
    gameState: 'playing'
  })),

  updateTime: (delta) => {
    const { timeRemaining, bossActive, level } = get()
    if (timeRemaining <= 0 && !bossActive) {
      get().spawnEnemy('boss')
      return
    }
    
    set(state => ({
      timeRemaining: Math.max(0, state.timeRemaining - delta)
    }))
  },

  resetGame: () => set({
    playerX: 0,
    playerY: -8,
    playerHealth: 3,
    score: 0,
    level: 1,
    gameState: 'menu',
    enemies: [],
    bullets: [],
    powerUps: [],
    activePowerUp: null,
    powerUpEndTime: 0,
    timeRemaining: 60,
    bossActive: false,
    isPlayerInvincible: false,
    isPlayerExploding: false,
    playerRespawnTime: 0
  })
}))
