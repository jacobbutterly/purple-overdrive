import Phaser from 'phaser'
import { GameScene } from './scenes/GameScene.js'

let gameInstance = null

export function createGame(containerId) {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }

  const container = document.getElementById(containerId)
  const w = container ? container.offsetWidth : window.innerWidth
  const h = container ? container.offsetHeight : window.innerHeight

  gameInstance = new Phaser.Game({
    type: Phaser.AUTO,
    width: w,
    height: h,
    backgroundColor: '#111111',
    parent: containerId,
    scene: [GameScene],
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: { default: 'arcade' },
    render: { antialias: true, pixelArt: false },
    input: { activePointers: 2 },
  })

  return gameInstance
}

export function destroyGame() {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
}
