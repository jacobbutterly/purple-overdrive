<template>
  <div class="app-root">
    <div id="game-canvas"></div>

    <StartScreen v-if="gameState.phase === 'start'" @start="startGame" />
    <GameHUD v-if="gameState.phase === 'playing'" />
    <ContinueScreen v-if="gameState.phase === 'continue'" />
    <GameOver v-if="gameState.phase === 'gameover'" @restart="restartGame" @home="returnHome" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'
import { gameState } from './gameState.js'
import { createGame, destroyGame } from './game/index.js'
import StartScreen from './components/StartScreen.vue'
import GameHUD from './components/GameHUD.vue'
import GameOver from './components/GameOver.vue'
import ContinueScreen from './components/ContinueScreen.vue'

let game = null

function startGame() {
  game = createGame('game-canvas')
}

function restartGame() {
  if (game) {
    game.destroy(true)
    game = null
  }
  setTimeout(() => {
    game = createGame('game-canvas')
  }, 100)
}

function returnHome() {
  if (game) {
    game.destroy(true)
    game = null
  }
  gameState.phase = 'start'
}

onUnmounted(() => {
  destroyGame()
})
</script>

<style scoped>
.app-root {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

#game-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
</style>
