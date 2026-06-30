<template>
  <div class="gameover-screen" :class="{ victory: gameState.victory, 'master-complete': gameState.bossDefeated }">
    <div class="gameover-content">

      <!-- Capture region: logo → bottom of stats box -->
      <div class="card-capture" ref="cardRef">
        <div class="gameover-logo" :class="{ 'gameover-logo--master': gameState.bossDefeated }">
          {{ gameState.bossDefeated ? '🏆' : gameState.victory ? '🏆' : '👾' }}
        </div>

        <div v-if="gameState.bossDefeated" class="boss-defeated-badge">
          ⚡ THE UNKNOWN FUTURE DEFEATED
        </div>

        <div v-if="gameState.playerName" class="player-greeting">
          {{ gameState.playerName }}
        </div>

        <h1 class="gameover-title" :class="{ 'gameover-title--master': gameState.bossDefeated }">
          {{ gameState.bossDefeated ? 'Master Complete' : gameState.victory ? 'Mission Accomplished' : 'Game Over' }}
        </h1>

        <p class="gameover-sub">
          {{ gameState.bossDefeated
            ? 'The Unknown Future has fallen. The A-Team secured the future.'
            : gameState.victory
              ? 'You overcame every challenge. The A-Team surges on!'
              : 'The challenges were too great — but the team fights on.' }}
        </p>

        <div class="gameover-stats">
          <div class="stat-row">
            <span class="stat-icon">🎯</span>
            <span class="stat-label">Score</span>
            <span class="stat-value">{{ formattedScore }}</span>
          </div>

          <div class="values-header">
            <span class="values-header-line" />
            <span class="values-header-text">Values Collected</span>
            <span class="values-header-line" />
          </div>

          <div
            class="stat-row value-row"
            v-for="(v, i) in valueStats"
            :key="v.key"
            :style="{ animationDelay: `${0.15 + i * 0.1}s` }"
          >
            <img :src="v.image" class="stat-icon stat-icon--img" :alt="v.label" />
            <span class="stat-label">{{ v.label }}</span>
            <span class="value-bar-wrap">
              <span class="value-bar" :style="{ width: valueBarWidth(v.count) }" />
            </span>
            <span class="stat-value" :class="{ 'stat-zero': v.count === 0 }">
              {{ v.count }}×
            </span>
          </div>
        </div>

      </div>
    <!-- /card-capture -->

      <div class="gameover-actions">
        <button class="copy-btn" :class="{ copied }" @click="copyScorecard">
          {{ copied ? '✓ Copied!' : '📋 Copy Score Card' }}
        </button>
        <button class="download-btn" :class="{ downloading }" @click="downloadImage" :disabled="downloading">
          {{ downloading ? '⏳ Saving...' : '📸 Download Image' }}
        </button>
        <button class="slack-btn" @click="openSlack">
          💬 Share on Slack
        </button>
        <button class="replay-btn" @click="$emit('restart')">
          ▶ Play Again
        </button>
        <button class="home-btn" @click="$emit('home')">
          🏠 Return to Home
        </button>
      </div>

      <p class="gameover-credit">Made by Jacob (with Builder) 🚀</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'
import { gameState } from '../gameState.js'

defineEmits(['restart', 'home'])

const cardRef = ref(null)
const copied = ref(false)
const downloading = ref(false)

const formattedScore = computed(() => gameState.score.toLocaleString())

const base = import.meta.env.BASE_URL
const valueStats = computed(() => [
  { key: 'innovation', image: `${base}assets/images/innovation.png`, label: 'Innovation', count: gameState.valuesCollected.innovation },
  { key: 'excellence', image: `${base}assets/images/excellence.png`, label: 'excellence', count: gameState.valuesCollected.excellence },
  { key: 'teamwork',   image: `${base}assets/images/teamwork.png`,   label: 'Teamwork',   count: gameState.valuesCollected.teamwork   },
  { key: 'integrity',  image: `${base}assets/images/integrity.png`,  label: 'Integrity',  count: gameState.valuesCollected.integrity  },
  { key: 'kindness',   image: `${base}assets/images/kindness.png`,   label: 'Kindness',   count: gameState.valuesCollected.kindness   },
  { key: 'passion',    image: `${base}assets/images/passion.png`,    label: 'Passion',    count: gameState.valuesCollected.passion    },
])

const maxCount = computed(() => Math.max(1, ...valueStats.value.map(v => v.count)))

function valueBarWidth(count) {
  return count === 0 ? '0%' : `${Math.round((count / maxCount.value) * 100)}%`
}

function buildScorecard() {
  const name = gameState.playerName || 'Agent'
  const outcome = gameState.bossDefeated
    ? '🏆 MASTER COMPLETE — THE UNKNOWN FUTURE DEFEATED'
    : gameState.victory ? '✅ MISSION ACCOMPLISHED' : '❌ Game Over'
  const score = gameState.score.toLocaleString()
  const vc = gameState.valuesCollected

  return [
    '👾 Purple Overdrive: A-Team Surge',
    `Agent: ${name}`,
    outcome,
    '─────────────────────────────────',
    `🎯 Score:        ${score}`,
    '── Values Collected ──────────────',
    `💡 Innovation:   ${vc.innovation}×`,
    `🏆 excellence:   ${vc.excellence}×`,
    `👥 Teamwork:     ${vc.teamwork}×`,
    `💎 Integrity:    ${vc.integrity}×`,
    `💚 Kindness:     ${vc.kindness}×`,
    `🔥 Passion:      ${vc.passion}×`,
    '─────────────────────────────────',
    ...(gameState.bossDefeated ? ['🏆 BOSS DEFEATED: The Unknown Future'] : []),
    'Can you beat this? 🚀 #PurpleOverdrive',
  ].join('\n')
}

async function downloadImage() {
  if (!cardRef.value || downloading.value) return
  downloading.value = true

  // Freeze all animated elements to their final visible state so html2canvas
  // captures them fully rendered rather than mid-animation.
  const animated = cardRef.value.querySelectorAll('.value-row, .gameover-logo, .gameover-title')
  const saved = []
  animated.forEach(el => {
    saved.push({ el, animation: el.style.animation, opacity: el.style.opacity, transform: el.style.transform })
    el.style.animation = 'none'
    el.style.opacity = '1'
    el.style.transform = 'none'
  })

  try {
    const canvas = await html2canvas(cardRef.value, {
      backgroundColor: gameState.victory ? '#0d2000' : '#0d0020',
      scale: 2,
      useCORS: true,
      logging: false,
    })
    const link = document.createElement('a')
    const name = (gameState.playerName || 'Agent').replace(/\s+/g, '_')
    const outcome = gameState.victory ? 'mission_accomplished' : 'game_over'
    link.download = `purple_overdrive_${name}_${outcome}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } finally {
    // Restore original styles
    saved.forEach(({ el, animation, opacity, transform }) => {
      el.style.animation = animation
      el.style.opacity = opacity
      el.style.transform = transform
    })
    downloading.value = false
  }
}

function openSlack() {
  window.open('https://slack.com/app_redirect?channel=purple-overdrive', '_blank')
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

.gameover-screen.master-complete {
  background: radial-gradient(ellipse at center, #2e1a00 0%, #1a0d00 60%, #000 100%);
}

.gameover-content {
  text-align: center;
  padding: 28px 20px;
  max-width: 440px;
  width: 100%;
}

.card-capture {
  padding: 24px 20px 16px;
  border-radius: 16px;
  background: radial-gradient(ellipse at top, #1a0a2e 0%, #0a0015 100%);
  margin-bottom: 20px;
}

.victory .card-capture {
  background: radial-gradient(ellipse at top, #1a2e0a 0%, #0a1500 100%);
}

.master-complete .card-capture {
  background: radial-gradient(ellipse at top, #2e1f00 0%, #150a00 100%);
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

.gameover-logo--master {
  filter: drop-shadow(0 0 28px #ff9900) drop-shadow(0 0 48px #ffd700aa) !important;
  animation: trophy-bounce 0.6s ease-out, master-glow 2s ease-in-out infinite 0.7s !important;
}

@keyframes master-glow {
  0%, 100% { filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 40px #ff990066); }
  50% { filter: drop-shadow(0 0 36px #ffd700) drop-shadow(0 0 60px #ff9900aa); }
}

.boss-defeated-badge {
  display: inline-block;
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  font-weight: bold;
  color: #ff9900;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1px solid #ff990066;
  border-radius: 20px;
  padding: 4px 14px;
  margin-bottom: 10px;
  background: rgba(255, 153, 0, 0.1);
  box-shadow: 0 0 12px #ff990044, inset 0 0 8px #ff990011;
  animation: badge-appear 0.4s ease-out, badge-glow 2s ease-in-out infinite 0.4s;
}

@keyframes badge-appear {
  from { opacity: 0; transform: scale(0.8) translateY(-8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes badge-glow {
  0%, 100% { box-shadow: 0 0 12px #ff990044, inset 0 0 8px #ff990011; }
  50% { box-shadow: 0 0 24px #ff9900aa, inset 0 0 12px #ff990033; }
}

.gameover-title--master {
  color: #ff9900 !important;
  text-shadow: 0 0 20px #ff990088, 0 0 40px #ffd70044 !important;
}

@keyframes trophy-bounce {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.15); }
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

.gameover-stats {
  background: rgba(155, 48, 255, 0.08);
  border: 1px solid rgba(155, 48, 255, 0.25);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
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

/* Values section header */
.values-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 4px;
}

.values-header-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, transparent, #cc44ff66);
}

.values-header-line:last-child {
  background: linear-gradient(to left, transparent, #cc44ff66);
}

.values-header-text {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.5vw, 12px);
  font-weight: bold;
  color: #cc44ff;
  letter-spacing: 3px;
  text-transform: uppercase;
  white-space: nowrap;
}

.victory .values-header-text { color: #ffd700; }
.victory .values-header-line {
  background: linear-gradient(to right, transparent, #ffd70066);
}
.victory .values-header-line:last-child {
  background: linear-gradient(to left, transparent, #ffd70066);
}

/* Value row animation */
.value-row {
  opacity: 0;
  animation: value-slide-in 0.4s ease-out forwards;
}

@keyframes value-slide-in {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* Mini bar inside value rows */
.value-bar-wrap {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 4px;
  overflow: hidden;
}

.value-bar {
  display: block;
  height: 100%;
  background: #cc44ff;
  border-radius: 4px;
  transition: width 0.6s ease-out;
}

.victory .value-bar { background: #ffd700; }

.stat-icon { font-size: 16px; width: 22px; flex-shrink: 0; }

.stat-icon--img { width: 20px; height: 20px; object-fit: contain; font-size: unset; }

.stat-label {
  width: 80px;
  font-size: clamp(11px, 3vw, 13px);
  color: #999;
  text-align: left;
  flex-shrink: 0;
}

.stat-value {
  font-size: clamp(13px, 3.5vw, 16px);
  color: #fff;
  font-weight: bold;
  flex-shrink: 0;
}

.stat-zero { color: #555; }

.gameover-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.copy-btn, .download-btn, .replay-btn, .home-btn {
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

.download-btn {
  background: transparent;
  color: #44ccff;
  border: 2px solid #44ccff55;
}

.download-btn:hover { border-color: #44ccff; }
.download-btn:disabled { opacity: 0.6; cursor: default; }
.download-btn.downloading { color: #888; border-color: #44444466; }

.slack-btn {
  background: transparent;
  color: #4a9eff;
  border: 2px solid #4a9eff55;
}

.slack-btn:hover { border-color: #4a9eff; }

.replay-btn {
  background: transparent;
  color: #cc44ff;
  border: 2px solid #cc44ff66;
}

.replay-btn:hover { border-color: #cc44ff; }

.home-btn {
  background: transparent;
  color: #aaa;
  border: 2px solid #ffffff22;
}

.home-btn:hover { border-color: #ffffff66; color: #fff; }

.gameover-hint {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #555;
  letter-spacing: 1px;
  margin-bottom: 4px;
}

.gameover-credit {
  font-family: 'Courier New', monospace;
  font-size: clamp(8px, 2vw, 10px);
  color: #3a3a3a;
  letter-spacing: 1px;
  margin: 0;
}
</style>
