<template>
  <div class="gameover-screen" :class="{ victory: gameState.victory }">
    <div class="gameover-content">
      <div class="gameover-logo">{{ gameState.victory ? '🏆' : '🟣' }}</div>

      <div v-if="gameState.playerName" class="player-greeting">
        {{ gameState.playerName }}
      </div>

      <h1 class="gameover-title">
        {{ gameState.victory ? 'Mission Accomplished' : 'Game Over' }}
      </h1>

      <p class="gameover-sub">
        {{ gameState.victory
          ? 'You overcame every challenge. The A-Team surges on!'
          : 'The challenges were too great — but the team fights on.' }}
      </p>

      <div v-if="gameState.victory" class="victory-chips">
        <span class="victory-chip">⚡ Innovation Deployed</span>
        <span class="victory-chip">🛡 Integrity Held</span>
        <span class="victory-chip">🎉 Mission Complete</span>
      </div>

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
  if (gameState.victory) return '3 ✓'
  return `${gameState.level}`
})

const weaponTierName = computed(() => {
  const names = ['Basic Shot', 'Prompt Laser', 'LLM Cyclone', 'Diffusion Shield']
  return names[Math.min(gameState.weaponTier, 3)]
})

function buildScorecard() {
  const name = gameState.playerName || 'Agent'
  const outcome = gameState.victory ? '✅ MISSION ACCOMPLISHED' : '❌ Game Over'
  const score = gameState.score.toLocaleString()
  const level = levelLabel.value
  const streak = gameState.bestStreak
  const team = gameState.teammateCount + 1
  const weapon = weaponTierName.value

  return [
    '🟣 Purple Overdrive: A-Team Surge',
    `Agent: ${name}`,
    outcome,
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
  transition: background 0.5s;
}

.gameover-screen.victory {
  background: radial-gradient(ellipse at center, #1a2e0a 0%, #0d2000 60%, #000 100%);
}

.gameover-content {
  text-align: center;
  padding: 28px 20px;
  max-width: 440px;
  width: 100%;
}

.gameover-logo {
  font-size: 52px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 16px #9B30FF);
}

.victory .gameover-logo {
  filter: drop-shadow(0 0 20px #ffd700);
  animation: trophy-bounce 0.6s ease-out;
}

@keyframes trophy-bounce {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.15); }
  100% { transform: scale(1); opacity: 1; }
}

.player-greeting {
  font-family: 'Courier New', monospace;
  font-size: clamp(11px, 3vw, 14px);
  color: #cc44ff;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.gameover-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(22px, 6vw, 36px);
  color: #9B30FF;
  text-shadow: 0 0 16px #9B30FF88;
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.victory .gameover-title {
  color: #ffd700;
  text-shadow: 0 0 20px #ffd70088, 0 0 40px #ffd70044;
}

.gameover-sub {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  color: #aaa;
  margin: 0 0 16px;
  line-height: 1.5;
  letter-spacing: 0.5px;
}

.victory-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-bottom: 16px;
}

.victory-chip {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 11px);
  color: #ffd700;
  border: 1px solid #ffd70044;
  border-radius: 20px;
  padding: 4px 10px;
  background: #ffd7000d;
}

.gameover-stats {
  background: rgba(155, 48, 255, 0.08);
  border: 1px solid rgba(155, 48, 255, 0.25);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.victory .gameover-stats {
  background: rgba(255, 215, 0, 0.06);
  border-color: rgba(255, 215, 0, 0.2);
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

.victory .copy-btn {
  background: #ffd700;
  color: #000;
  box-shadow: 0 0 20px #ffd70066;
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
