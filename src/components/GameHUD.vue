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
        <div class="hud-timer" :class="{ 'hud-timer--urgent': gameState.timeRemaining <= 30 }">
          {{ formattedTime }}
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
      <div v-if="gameState.hasIntegrity" class="hud-icon hud-icon--integrity" title="Integrity Shield">🛡</div>
      <div v-if="gameState.passionActive" class="hud-icon hud-icon--passion" title="Passion Mode!">🔥</div>
      <div v-if="gameState.disruptionActive" class="hud-icon hud-icon--disruption" title="Market Disruption!">⚠</div>
      <div v-for="i in gameState.teammateCount" :key="i" class="hud-icon hud-icon--teammate">👤</div>
      <div v-if="gameState.weaponTier > 0" class="hud-icon hud-icon--weapon">{{ weaponIcon }}</div>
    </div>

    <!-- Boss health bar -->
    <div v-if="gameState.bossActive" class="hud-boss-bar">
      <div class="hud-boss-label">⚠ THE UNKNOWN FUTURE</div>
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
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { gameState } from '../gameState.js'

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

const weaponIcon = computed(() => {
  const icons = ['', '⚡', '🌀', '✨']
  return icons[gameState.weaponTier] || '✨'
})

const disruptionLabel = computed(() => {
  return gameState.disruptionType === 'inverted' ? 'Controls Inverted!' : 'Weapons Offline!'
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
</style>
