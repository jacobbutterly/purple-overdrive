<template>
  <div class="continue-overlay">
    <div class="continue-panel">
      <div class="continue-icon">⏰</div>
      <h2 class="continue-title">Time's Up!</h2>
      <p class="continue-body">
        The clock has run out — but the battle isn't over.<br>
        Survive until the end or go down fighting.
      </p>

      <div class="continue-boss-note" v-if="gameState.bossActive">
        <span class="boss-pulse">⚠</span> The Unknown Future still looms!
      </div>

      <div class="continue-actions">
        <button class="continue-fight-btn grow-pulse" @click="keepFighting">
          ⚡ Keep Fighting
        </button>
        <button class="continue-end-btn" @click="endMission">
          {{ gameState.bossActive ? '✓ End Mission' : '🏆 Mission Accomplished' }}
        </button>
      </div>

      <p class="continue-hint">ESC / P to pause mid-run</p>
    </div>
  </div>
</template>

<script setup>
import { gameState } from '../gameState.js'
import { AudioSystem } from '../game/systems/AudioSystem.js'

const audio = new AudioSystem()

function keepFighting() {
  gameState.continueMode = true
  gameState.timeRemaining = 0
  gameState.paused = false
  gameState.phase = 'playing'
}

function endMission() {
  gameState.victory = true  // surviving to time limit = mission accomplished
  gameState.endRequested = true
  gameState.paused = false
  gameState.phase = 'playing'
}
</script>

<style scoped>
.continue-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 180;
  backdrop-filter: blur(4px);
}

.continue-panel {
  background: radial-gradient(ellipse at top, #1a0a2e 0%, #0a0015 100%);
  border: 2px solid #9B30FF55;
  border-radius: 16px;
  padding: 36px 28px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 0 60px #9B30FF33;
  animation: panel-in 0.3s ease-out;
}

@keyframes panel-in {
  from { transform: scale(0.85); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

.continue-icon {
  font-size: 52px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 12px #9B30FF);
}

.continue-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(22px, 6vw, 32px);
  color: #cc44ff;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 10px;
  text-shadow: 0 0 16px #9B30FF88;
}

.continue-body {
  font-family: 'Courier New', monospace;
  font-size: clamp(11px, 3vw, 13px);
  color: #aaa;
  line-height: 1.6;
  margin: 0 0 16px;
}

.continue-boss-note {
  font-family: 'Courier New', monospace;
  font-size: clamp(11px, 3vw, 13px);
  color: #ff4444;
  margin-bottom: 20px;
  letter-spacing: 1px;
}

.boss-pulse {
  display: inline-block;
  animation: boss-warn 0.7s ease-in-out infinite alternate;
}

@keyframes boss-warn {
  from { opacity: 0.4; }
  to   { opacity: 1; }
}

.continue-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.continue-fight-btn,
.continue-end-btn {
  font-family: 'Courier New', monospace;
  font-size: clamp(13px, 3.5vw, 16px);
  padding: 14px 24px;
  border-radius: 40px;
  border: none;
  cursor: pointer;
  letter-spacing: 2px;
  font-weight: bold;
  transition: transform 0.15s, box-shadow 0.15s;
}

.continue-fight-btn {
  background: #9B30FF;
  color: #fff;
  box-shadow: 0 0 20px #9B30FF66;
}

.grow-pulse {
  animation: grow-pulse 1.1s ease-in-out infinite;
}

@keyframes grow-pulse {
  0%, 100% { transform: scale(1);    box-shadow: 0 0 20px #9B30FF66; }
  50%       { transform: scale(1.07); box-shadow: 0 0 40px #9B30FFcc; }
}

.continue-fight-btn:active { transform: scale(0.96) !important; animation: none; }

.continue-end-btn {
  background: transparent;
  color: #cc44ff;
  border: 2px solid #cc44ff55;
}

.continue-end-btn:hover { border-color: #cc44ff; }
.continue-end-btn:active { transform: scale(0.96); }

.continue-hint {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 10px);
  color: #444;
  letter-spacing: 1px;
  margin: 0;
}
</style>
