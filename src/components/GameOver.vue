<template>
  <div class="gameover-screen">
    <div class="gameover-content">
      <div class="gameover-logo">🟣</div>
      <h1 class="gameover-title">Game Over</h1>
      <p class="gameover-sub">A-Team Surge Complete</p>

      <div class="gameover-stats">
        <div class="stat-row">
          <span class="stat-icon">⚡</span>
          <span class="stat-label">Score</span>
          <span class="stat-value">{{ formattedScore }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">🏆</span>
          <span class="stat-label">Level Reached</span>
          <span class="stat-value">{{ levelLabel }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">🔥</span>
          <span class="stat-label">Best Streak</span>
          <span class="stat-value">{{ gameState.bestStreak }}×</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">👥</span>
          <span class="stat-label">Team Size</span>
          <span class="stat-value">{{ gameState.teammateCount + 1 }} {{ gameState.teammateCount === 0 ? '(Solo)' : 'allies' }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-icon">⚙</span>
          <span class="stat-label">Weapon Tier</span>
          <span class="stat-value">{{ weaponTierName }}</span>
        </div>
      </div>

      <div class="gameover-actions">
        <button class="copy-btn" :class="{ copied }" @click="copyScorecard">
          {{ copied ? '✓ Copied!' : '📋 Copy Score Card' }}
        </button>
        <button class="replay-btn" @click="$emit('restart')">
          ▶ Play Again
        </button>
      </div>

      <p class="gameover-hint">Share your score on Slack or Teams!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameState } from '../gameState.js'

defineEmits(['restart'])

const copied = ref(false)

const formattedScore = computed(() => gameState.score.toLocaleString())

const levelLabel = computed(() => {
  if (gameState.bossActive === false && gameState.level === 3 && gameState.timeRemaining <= 0) {
    return '3 (Survived!)'
  }
  return `${gameState.level}`
})

const weaponTierName = computed(() => {
  const names = ['Basic Shot', 'Prompt Laser', 'LLM Cyclone', 'Diffusion Shield']
  return names[Math.min(gameState.weaponTier, 3)]
})

function buildScorecard() {
  const score = gameState.score.toLocaleString()
  const level = gameState.level
  const streak = gameState.bestStreak
  const team = gameState.teammateCount + 1
  const weapon = weaponTierName.value

  return [
    '🟣 Purple Overdrive: A-Team Surge',
    '─────────────────────────────────',
    `⚡ Score:        ${score}`,
    `🏆 Level:        ${level}`,
    `🔥 Best Streak:  ${streak}×`,
    `👥 Team Size:    ${team} ${team === 1 ? 'solo' : 'strong'}`,
    `⚙  Weapon:      ${weapon}`,
    '─────────────────────────────────',
    'Can you beat this? 🚀 #PurpleOverdrive',
  ].join('\n')
}

function copyScorecard() {
  const text = buildScorecard()
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true
    setTimeout(() => { copied.value = false }, 3000)
  }).catch(() => {
    // Fallback
    const el = document.createElement('textarea')
    el.value = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
    copied.value = true
    setTimeout(() => { copied.value = false }, 3000)
  })
}
</script>

<style scoped>
.gameover-screen {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0020 60%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  overflow-y: auto;
}

.gameover-content {
  text-align: center;
  padding: 28px 20px;
  max-width: 440px;
  width: 100%;
}

.gameover-logo {
  font-size: 48px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 16px #9B30FF);
}

.gameover-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(24px, 6.5vw, 38px);
  color: #9B30FF;
  text-shadow: 0 0 16px #9B30FF88;
  margin: 0 0 4px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.gameover-sub {
  font-family: 'Courier New', monospace;
  font-size: clamp(11px, 3vw, 14px);
  color: #ff44cc;
  margin: 0 0 24px;
  letter-spacing: 3px;
}

.gameover-stats {
  background: rgba(155, 48, 255, 0.08);
  border: 1px solid rgba(155, 48, 255, 0.25);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.stat-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  font-family: 'Courier New', monospace;
}

.stat-row:last-child { border-bottom: none; }

.stat-icon { font-size: 16px; width: 22px; }

.stat-label {
  flex: 1;
  font-size: clamp(11px, 3vw, 13px);
  color: #999;
  text-align: left;
}

.stat-value {
  font-size: clamp(13px, 3.5vw, 16px);
  color: #fff;
  font-weight: bold;
}

.gameover-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.copy-btn, .replay-btn {
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

.copy-btn {
  background: #9B30FF;
  color: #fff;
  box-shadow: 0 0 20px #9B30FF66;
}

.copy-btn.copied {
  background: #44ff88;
  color: #000;
  box-shadow: 0 0 20px #44ff8866;
}

.copy-btn:active, .replay-btn:active { transform: scale(0.96); }

.replay-btn {
  background: transparent;
  color: #cc44ff;
  border: 2px solid #cc44ff66;
}

.replay-btn:hover { border-color: #cc44ff; }

.gameover-hint {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #555;
  letter-spacing: 1px;
}
</style>
