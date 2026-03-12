import React from 'react'
import { useGameStore } from './gameStore'

const GameUI: React.FC = () => {
  const { 
    gameState, 
    playerLives, 
    score, 
    level, 
    timeRemaining,
    activePowerUp,
    startGame, 
    nextLevel,
    resetGame
  } = useGameStore()

  const getPowerUpName = (type: typeof activePowerUp) => {
    switch (type) {
      case 'spread': return '散弹'
      case 'missile': return '辅助导弹'
      case 'laser': return '5束激光'
      default: return ''
    }
  }

  if (gameState === 'menu') {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#4CAF50' }}>3D打飞机</h1>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>竖版闯关游戏</p>
        <button 
          onClick={startGame}
          style={{
            padding: '15px 30px',
            fontSize: '24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          开始游戏
        </button>
        <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.8 }}>
          <p>方向键控制飞机移动</p>
          <p>空格键射击</p>
          <p>3种道具: 散弹、辅助导弹、5束激光</p>
        </div>
      </div>
    )
  }

  if (gameState === 'gameOver') {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '64px', marginBottom: '20px', color: '#F44336', fontWeight: 'bold' }}>GAME OVER</h1>
        <p style={{ fontSize: '32px', marginBottom: '10px' }}>得分: {score}</p>
        <p style={{ fontSize: '24px', marginBottom: '40px' }}>关卡: {level}</p>
        <button 
          onClick={resetGame}
          style={{
            padding: '15px 30px',
            fontSize: '24px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          返回菜单
        </button>
      </div>
    )
  }

  if (gameState === 'levelComplete') {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.7)',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <h1 style={{ fontSize: '48px', marginBottom: '20px', color: '#4CAF50' }}>
          {level >= 3 ? '游戏通关!' : `第${level}关完成!`}
        </h1>
        <p style={{ fontSize: '32px', marginBottom: '40px' }}>得分: {score}</p>
        {level < 3 ? (
          <button 
            onClick={nextLevel}
            style={{
              padding: '15px 30px',
              fontSize: '24px',
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            下一关
          </button>
        ) : (
          <button 
            onClick={resetGame}
            style={{
              padding: '15px 30px',
              fontSize: '24px',
              background: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            返回菜单
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      padding: '20px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start'
    }}>
      <div>
        <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>
          生命: {'❤️'.repeat(playerLives)}
        </p>
        <p style={{ fontSize: '20px', margin: 0 }}>得分: {score}</p>
      </div>
      
      <div style={{ textAlign: 'right' }}>
        <p style={{ fontSize: '24px', margin: '0 0 10px 0' }}>第 {level} 关</p>
        <p style={{ fontSize: '20px', margin: 0 }}>
          剩余时间: {Math.ceil(timeRemaining)}s
        </p>
      </div>

      {activePowerUp && (
        <div style={{
          position: 'absolute',
          top: '100px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.5)',
          padding: '10px 20px',
          borderRadius: '20px',
          color: '#FFEB3B',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {getPowerUpName(activePowerUp)}
        </div>
      )}
    </div>
  )
}

export default GameUI
