<template>
  <div class="hud-overlay">
    <!-- Top bar -->
    <div class="hud-top">
      <div class="hud-score-block">
        <div class="hud-label">SCORE</div>
        <div class="hud-score">{{ formattedScore }}</div>
      </div>
      <div class="hud-center-block">
        <div class="hud-level-badge" :style="{ background: levelColor }">LVL {{ gameState.level }}</div>
        <div class="hud-timer" :class="{ 'hud-timer--urgent': gameState.timeRemaining <= 30 && !gameState.continueMode, 'hud-timer--overtime': gameState.continueMode }">
          {{ gameState.continueMode ? 'OVERTIME' : formattedTime }}
        </div>
      </div>
      <div class="hud-streak-block">
        <div class="hud-label">STREAK</div>
        <div class="hud-streak" :class="{ 'hud-streak--active': gameState.streakMultiplier > 1 }">
          {{ gameState.streakMultiplier }}×
        </div>
      </div>
    </div>

    <!-- Health bar -->
    <div class="hud-health-row">
      <div class="hud-health-label">CAPACITY</div>
      <div class="hud-health-track">
        <div
          class="hud-health-fill"
          :style="{ width: gameState.health + '%', background: healthBarColor }"
        ></div>
      </div>
      <div class="hud-health-pct">{{ Math.round(gameState.health) }}%</div>
    </div>

    <!-- Status icons row -->
    <div class="hud-status-row">
      <div v-if="gameState.hasIntegrity" class="hud-shield-group">
        <img :src="base + 'assets/images/integrity.png'" class="hud-value-icon hud-icon--integrity" title="Integrity Shield" />
        <span class="hud-shield-label">SHIELD ACTIVE</span>
      </div>
      <img v-if="gameState.passionActive" :src="base + 'assets/images/passion.png'" class="hud-value-icon hud-icon--passion" title="Passion Mode!" />
      <div v-if="gameState.disruptionActive" class="hud-icon hud-icon--disruption" title="Market Disruption!">⚠</div>
      <img v-for="i in gameState.teammateCount" :key="i" :src="base + 'assets/images/teamwork.png'" class="hud-value-icon hud-icon--teammate" />
      <img v-if="gameState.weaponTier > 0" :src="base + 'assets/images/innovation.png'" class="hud-value-icon hud-icon--weapon" title="Weapon Upgraded" />
    </div>

    <!-- Boss health bar -->
    <div v-if="gameState.bossActive" class="hud-boss-bar">
      <div class="hud-boss-label">⚠ THE VUCA WORLD</div>
      <div class="hud-boss-track">
        <div class="hud-boss-fill" :style="{ width: bossHealthPct + '%' }"></div>
      </div>
    </div>

    <!-- Disruption alert -->
    <div v-if="gameState.disruptionActive" class="hud-disruption-banner">
      ⚠ MARKET DISRUPTION — {{ disruptionLabel }}
    </div>

    <!-- Passion overlay -->
    <div v-if="gameState.passionActive" class="hud-passion-border"></div>

    <!-- Pause button -->
    <button class="hud-pause-btn" @click="togglePause" :title="gameState.paused ? 'Resume (P)' : 'Pause (P)'">
      {{ gameState.paused ? '▶' : '⏸' }}
    </button>

    <!-- Pause overlay -->
    <div v-if="gameState.paused" class="pause-overlay">
      <div class="pause-panel">
        <div class="pause-logo">👾</div>
        <h2 class="pause-title">PAUSED</h2>
        <div class="pause-controls">
          <div class="pause-control-row">
            <span class="pause-key">W A S D</span>
            <span class="pause-sep">or</span>
            <span class="pause-key">↑ ← ↓ →</span>
            <span class="pause-action">Move</span>
          </div>
          <div class="pause-control-row">
            <span class="pause-key">P / Esc</span>
            <span class="pause-action">Pause / Resume</span>
          </div>
        </div>
        <button class="pause-resume-btn" @click="togglePause">▶ RESUME</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const base = import.meta.env.BASE_URL
import { gameState } from '../gameState.js'

function togglePause() {
  gameState.paused = !gameState.paused
}

const formattedScore = computed(() => {
  return gameState.score.toLocaleString()
})

const formattedTime = computed(() => {
  const t = gameState.timeRemaining
  const m = Math.floor(t / 60)
  const s = t % 60
  return `${m}:${String(s).padStart(2, '0')}`
})

const levelColor = computed(() => {
  if (gameState.level === 1) return '#444'
  if (gameState.level === 2) return '#7722cc'
  return '#9B30FF'
})

const healthBarColor = computed(() => {
  const h = gameState.health
  if (h > 60) return '#44ff88'
  if (h > 30) return '#ffdd00'
  return '#ff4444'
})

const disruptionLabel = computed(() => {
  if (gameState.disruptionType === 'inverted') return 'Controls Inverted!'
  return 'Rely on your teammates to help you!'
})

const bossHealthPct = computed(() => {
  if (!gameState.bossMaxHealth) return 0
  return Math.max(0, (gameState.bossHealth / gameState.bossMaxHealth) * 100)
})
</script>

<style scoped>
.hud-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  font-family: 'Courier New', monospace;
}

.hud-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 12px 16px 0;
  gap: 8px;
}

.hud-label {
  font-size: 9px;
  color: #888;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.hud-score-block, .hud-streak-block {
  background: rgba(0, 0, 0, 0.55);
  border-radius: 8px;
  padding: 6px 10px;
  min-width: 72px;
}

.hud-score {
  font-size: clamp(14px, 4vw, 20px);
  color: #9B30FF;
  font-weight: bold;
  text-shadow: 0 0 8px #9B30FF88;
}

.hud-streak {
  font-size: clamp(16px, 4.5vw, 22px);
  color: #888;
  font-weight: bold;
}

.hud-streak--active {
  color: #ffdd00;
  text-shadow: 0 0 10px #ffdd0088;
  animation: streak-pulse 0.8s ease-in-out infinite;
}

@keyframes streak-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
}

.hud-center-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.hud-level-badge {
  font-size: 10px;
  color: #fff;
  letter-spacing: 2px;
  padding: 3px 10px;
  border-radius: 12px;
  font-weight: bold;
}

.hud-timer {
  font-size: clamp(22px, 6vw, 34px);
  color: #fff;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255,255,255,0.4);
  background: rgba(0,0,0,0.55);
  padding: 4px 12px;
  border-radius: 8px;
}

.hud-timer--urgent {
  color: #ff4444;
  text-shadow: 0 0 12px #ff444488;
  animation: timer-blink 0.5s ease-in-out infinite;
}

.hud-timer--overtime {
  color: #ff8800;
  font-size: clamp(14px, 4vw, 22px);
  text-shadow: 0 0 12px #ff880088;
  letter-spacing: 1px;
  animation: timer-blink 1.2s ease-in-out infinite;
}

@keyframes timer-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.hud-health-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px 0;
}

.hud-health-label {
  font-size: 9px;
  color: #888;
  letter-spacing: 1px;
  white-space: nowrap;
}

.hud-health-track {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
  overflow: hidden;
}

.hud-health-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.2s ease, background 0.5s ease;
}

.hud-health-pct {
  font-size: 10px;
  color: #aaa;
  min-width: 32px;
  text-align: right;
}

.hud-status-row {
  display: flex;
  gap: 6px;
  padding: 6px 16px 0;
}

.hud-icon {
  font-size: 18px;
  background: rgba(0,0,0,0.5);
  border-radius: 6px;
  padding: 2px 6px;
}

.hud-value-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  background: rgba(0,0,0,0.5);
  border-radius: 6px;
  padding: 3px;
  box-sizing: border-box;
}

.hud-shield-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

.hud-shield-label {
  font-family: 'Courier New', monospace;
  font-size: 9px;
  font-weight: bold;
  color: #44ffdd;
  letter-spacing: 2px;
  text-shadow: 0 0 8px #44ffdd99;
  animation: shield-label-pulse 1.6s ease-in-out infinite;
}

.hud-icon--integrity {
  animation: shield-glow 1.6s ease-in-out infinite;
}

@keyframes shield-glow {
  0%, 100% { box-shadow: 0 0 6px #44ffdd88; transform: scale(1); }
  50% { box-shadow: 0 0 16px #44ffddcc, 0 0 28px #44ffdd55; transform: scale(1.1); }
}

@keyframes shield-label-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

.hud-icon--passion { animation: passion-flash 0.3s ease-in-out infinite alternate; }
@keyframes passion-flash { from { opacity: 1; } to { opacity: 0.5; } }

.hud-icon--disruption { color: #ff4444; animation: disruption-shake 0.15s ease-in-out infinite alternate; }
@keyframes disruption-shake { from { transform: translateX(-2px); } to { transform: translateX(2px); } }

.hud-boss-bar {
  position: fixed;
  bottom: 20px;
  left: 16px;
  right: 16px;
  pointer-events: none;
}

.hud-boss-label {
  font-size: clamp(9px, 2.5vw, 11px);
  color: #ff4444;
  letter-spacing: 2px;
  margin-bottom: 4px;
  text-align: center;
  text-shadow: 0 0 8px #ff444488;
}

.hud-boss-track {
  height: 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid #ff444466;
}

.hud-boss-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff4444, #ff8844);
  border-radius: 5px;
  transition: width 0.3s ease;
}

.hud-disruption-banner {
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  text-align: center;
  font-size: clamp(12px, 3.5vw, 16px);
  color: #ff4444;
  letter-spacing: 2px;
  padding: 8px;
  background: rgba(255,0,0,0.15);
  animation: disruption-pulse 0.4s ease-in-out infinite alternate;
  pointer-events: none;
}

@keyframes disruption-pulse {
  from { opacity: 0.7; }
  to { opacity: 1; }
}

.hud-passion-border {
  position: fixed;
  inset: 0;
  border: 6px solid #ff4444;
  border-radius: 0;
  pointer-events: none;
  animation: passion-border 0.2s ease-in-out infinite alternate;
}

@keyframes passion-border {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

.hud-pause-btn {
  position: fixed;
  top: 12px;
  right: 16px;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid #ffffff22;
  border-radius: 8px;
  color: #fff;
  font-size: 18px;
  padding: 5px 10px;
  cursor: pointer;
  z-index: 60;
  transition: background 0.15s, border-color 0.15s;
  line-height: 1;
}

.hud-pause-btn:hover { background: rgba(155, 48, 255, 0.5); border-color: #9B30FF88; }
.hud-pause-btn:active { transform: scale(0.94); }

.pause-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 55;
  pointer-events: auto;
  backdrop-filter: blur(4px);
}

.pause-panel {
  background: linear-gradient(160deg, #1a0a2e 0%, #0d0020 100%);
  border: 1px solid #9B30FF44;
  border-radius: 16px;
  padding: 36px 40px;
  text-align: center;
  max-width: 360px;
  width: 90%;
  box-shadow: 0 0 60px #9B30FF33;
}

.pause-logo {
  font-size: 42px;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 16px #9B30FF);
}

.pause-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(22px, 6vw, 32px);
  color: #9B30FF;
  text-shadow: 0 0 16px #9B30FF88;
  margin: 0 0 24px;
  letter-spacing: 6px;
}

.pause-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
  text-align: left;
  background: #ffffff08;
  border: 1px solid #ffffff11;
  border-radius: 10px;
  padding: 14px 16px;
}

.pause-control-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.pause-key {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  color: #ddd;
  background: #333;
  border: 1px solid #555;
  border-bottom: 2px solid #222;
  border-radius: 4px;
  padding: 3px 8px;
  white-space: nowrap;
}

.pause-sep {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #555;
}

.pause-action {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.5vw, 12px);
  color: #888;
}

.pause-resume-btn {
  font-family: 'Courier New', monospace;
  font-size: clamp(14px, 4vw, 18px);
  color: #fff;
  letter-spacing: 3px;
  background: #9B30FF;
  border: none;
  border-radius: 40px;
  padding: 13px 32px;
  cursor: pointer;
  box-shadow: 0 0 24px #9B30FF88;
  transition: transform 0.15s, box-shadow 0.15s;
}

.pause-resume-btn:hover { box-shadow: 0 0 36px #9B30FFcc; transform: scale(1.03); }
.pause-resume-btn:active { transform: scale(0.96); }
</style>
