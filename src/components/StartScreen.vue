<template>
  <div class="start-screen">
    <div class="start-content">
      <!-- Shared header — always visible above tabs -->
      <div class="start-logo">👾</div>
      <h1 class="start-title">Purple Overdrive</h1>
      <p class="start-subtitle">A-Team Surge</p>
      <p class="start-tagline">3 Minutes. 3 Levels. One Team.</p>

      <!-- Tab bar -->
      <div class="tab-bar">
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'mission' }"
          @click="activeTab = 'mission'"
        >MISSION</button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'guide' }"
          @click="activeTab = 'guide'"
        >GUIDE</button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'howtoplay' }"
          @click="activeTab = 'howtoplay'"
        >HOW TO PLAY</button>
      </div>

      <!-- MISSION tab -->
      <div v-show="activeTab === 'mission'" class="tab-panel">
        <div class="mission-brief">
          <p>Overcome the challenges threatening the A-Team.</p>
          <p>Collect values, build your team, and survive all three levels to achieve mission success.</p>
        </div>

        <div class="name-section">
          <label class="name-label" for="player-name">Your Callsign</label>
          <input
            id="player-name"
            v-model="playerName"
            class="name-input"
            type="text"
            placeholder="Enter your name..."
            maxlength="20"
            @keydown.enter="handleStart"
            autocomplete="off"
            spellcheck="false"
          />
        </div>

        <button
          class="start-btn"
          :class="{ pulse: !tapped }"
          :disabled="tapped"
          @click="handleStart"
        >
          {{ tapped ? 'Get Ready...' : 'LAUNCH MISSION' }}
        </button>

        <p class="controls-hint">WASD / arrows to move · auto-fires · touch to drag</p>
      </div>

      <!-- FIELD GUIDE tab -->
      <div v-show="activeTab === 'guide'" class="tab-panel">
        <!-- THREATS -->
        <div class="field-section">
          <div class="field-section-title">THREATS</div>
          <div class="threats-grid">
            <div class="threat-card threat-card--common">
              <div class="threat-silhouette threat-silhouette--common"></div>
              <span class="threat-label">⚠ Workplace Challenge</span>
            </div>
            <div class="threat-card threat-card--rare">
              <div class="threat-silhouette threat-silhouette--rare"></div>
              <span class="threat-label">★ Rare Threat</span>
              <span class="threat-rarity-badge">RARE</span>
            </div>
            <div class="threat-card threat-card--swarm">
              <div class="threat-silhouette threat-silhouette--swarm">
                <span class="swarm-dot"></span>
                <span class="swarm-dot"></span>
                <span class="swarm-dot"></span>
                <span class="swarm-dot"></span>
                <span class="swarm-dot"></span>
              </div>
              <span class="threat-label">🔔 Notification Swarm</span>
            </div>
            <div class="threat-card threat-card--boss">
              <div class="threat-silhouette threat-silhouette--boss"></div>
              <span class="threat-label threat-label--boss">⚠ THE VUCA WORLD</span>
            </div>
          </div>
        </div>

        <!-- VALUES -->
        <div class="field-section">
          <div class="field-section-title">VALUES</div>
          <div class="values-grid">
            <div
              v-for="v in valueGuide"
              :key="v.key"
              class="value-card"
              :style="{ borderLeftColor: v.cssColor }"
            >
              <img :src="v.image" class="value-card-icon" :alt="v.name" />
              <div class="value-card-info">
                <span class="value-card-name">{{ v.name }}</span>
                <span class="value-card-effect">{{ v.effect }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- HOW TO PLAY tab -->
      <div v-show="activeTab === 'howtoplay'" class="tab-panel">
        <!-- CONTROLS -->
        <div class="field-section">
          <div class="field-section-title">CONTROLS</div>
          <div class="controls-block">
            <div class="control-row">
              <div class="control-keys">
                <span class="key">W</span>
                <span class="key">A</span>
                <span class="key">S</span>
                <span class="key">D</span>
                <span class="key-sep">or</span>
                <span class="key arrow">↑</span>
                <span class="key arrow">←</span>
                <span class="key arrow">↓</span>
                <span class="key arrow">→</span>
              </div>
              <span class="control-desc">Move</span>
            </div>
            <div class="control-row">
              <div class="control-keys">
                <span class="key key--wide">Auto</span>
              </div>
              <span class="control-desc">Fire — stay near enemies</span>
            </div>
            <div class="control-row">
              <div class="control-keys">
                <span class="key key--wide">Touch</span>
              </div>
              <span class="control-desc">Drag to move on mobile</span>
            </div>
          </div>
        </div>

        <!-- TIPS -->
        <div class="field-section">
          <div class="field-section-title">HOW TO SURVIVE</div>
          <div class="tutorial-list">
            <div class="tutorial-item">
              <span class="tutorial-icon">🕹</span>
              <div class="tutorial-text">
                <span class="tutorial-heading">Move to fire</span>
                <span class="tutorial-body">Your ship auto-fires at the nearest enemy. Get close to deal damage.</span>
              </div>
            </div>
            <div class="tutorial-item">
              <span class="tutorial-icon">💜</span>
              <div class="tutorial-text">
                <span class="tutorial-heading">Guard your capacity</span>
                <span class="tutorial-body">You have 100 capacity. Enemies drain it on contact. Reach zero and it's game over.</span>
              </div>
            </div>
            <div class="tutorial-item">
              <span class="tutorial-icon">✨</span>
              <div class="tutorial-text">
                <span class="tutorial-heading">Collect values</span>
                <span class="tutorial-body">Defeated enemies drop value orbs. Fly into them to unlock powerups.</span>
              </div>
            </div>
            <div class="tutorial-item">
              <span class="tutorial-icon">📈</span>
              <div class="tutorial-text">
                <span class="tutorial-heading">Three escalating levels</span>
                <span class="tutorial-body">New, tougher threats appear at 1:00 and 2:00. Rare enemies emerge mid-game.</span>
              </div>
            </div>
            <div class="tutorial-item tutorial-item--boss">
              <span class="tutorial-icon">⚡</span>
              <div class="tutorial-text">
                <span class="tutorial-heading">Face The VUCA World</span>
                <span class="tutorial-body">The boss arrives in the final 15 seconds. Defeat it to achieve Master Complete.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { gameState } from '../gameState.js'
import { POWERUP_TYPES } from '../game/constants.js'

const emit = defineEmits(['start'])
const tapped = ref(false)
const playerName = ref('')
const activeTab = ref('mission')

const valueGuide = [
  { key: 'innovation', image: POWERUP_TYPES.innovation.image, name: POWERUP_TYPES.innovation.name, effect: POWERUP_TYPES.innovation.effect, cssColor: '#ffcc00' },
  { key: 'kindness',   image: POWERUP_TYPES.kindness.image,   name: POWERUP_TYPES.kindness.name,   effect: POWERUP_TYPES.kindness.effect,   cssColor: '#44ff88' },
  { key: 'teammate',   image: POWERUP_TYPES.teammate.image,   name: POWERUP_TYPES.teammate.name,   effect: POWERUP_TYPES.teammate.effect,   cssColor: '#ff44cc' },
  { key: 'integrity',  image: POWERUP_TYPES.integrity.image,  name: POWERUP_TYPES.integrity.name,  effect: POWERUP_TYPES.integrity.effect,  cssColor: '#4488ff' },
  { key: 'excellence', image: POWERUP_TYPES.excellence.image, name: POWERUP_TYPES.excellence.name, effect: POWERUP_TYPES.excellence.effect, cssColor: '#ffdd00' },
  { key: 'passion',    image: POWERUP_TYPES.passion.image,    name: POWERUP_TYPES.passion.name,    effect: POWERUP_TYPES.passion.effect,    cssColor: '#ff4444' },
]

function handleStart() {
  if (tapped.value) return
  gameState.playerName = playerName.value.trim() || 'Agent'
  tapped.value = true
  setTimeout(() => emit('start'), 400)
}
</script>

<style scoped>
.start-screen {
  position: fixed;
  inset: 0;
  background: radial-gradient(ellipse at center, #1a0a2e 0%, #0d0020 60%, #000 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  overflow-y: auto;
  padding: 16px 0;
}

.start-content {
  text-align: center;
  padding: 24px 20px;
  max-width: 480px;
  width: 100%;
}

.start-logo {
  font-size: 52px;
  margin-bottom: 6px;
  filter: drop-shadow(0 0 20px #9B30FF);
}

.start-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(24px, 7vw, 40px);
  color: #9B30FF;
  text-shadow: 0 0 20px #9B30FF, 0 0 40px #9B30FF88;
  margin: 0 0 4px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.start-subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(13px, 4vw, 18px);
  color: #ff44cc;
  text-shadow: 0 0 12px #ff44cc88;
  margin: 0 0 4px;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.start-tagline {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  color: #666;
  margin: 0 0 18px;
}

/* ── Tab bar ── */
.tab-bar {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #9B30FF33;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.5vw, 13px);
  color: #666;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 10px 4px;
  cursor: pointer;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.2s, border-color 0.2s;
}

.tab-btn:hover { color: #aaa; }

.tab-btn--active {
  color: #fff;
  border-bottom-color: #9B30FF;
  border-left: 2px solid #9B30FF;
  background: #9B30FF11;
}

/* ── Tab panels ── */
.tab-panel {
  text-align: left;
  animation: tab-fade-in 0.2s ease;
}

@keyframes tab-fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── MISSION tab ── */
.mission-brief {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 22px;
  border: 1px solid #9B30FF33;
  border-radius: 10px;
  padding: 12px 16px;
  background: #9B30FF0a;
  text-align: center;
}

.mission-brief p { margin: 0 0 4px; }
.mission-brief p:last-child { margin-bottom: 0; }

.controls-hint {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 10px);
  color: #555;
  text-align: center;
  margin: 12px 0 0;
  letter-spacing: 0.5px;
}

/* ── Name input ── */
.name-section {
  margin-bottom: 20px;
}

.name-label {
  display: block;
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #cc44ff;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.name-input {
  width: 100%;
  box-sizing: border-box;
  font-family: 'Courier New', monospace;
  font-size: clamp(14px, 3.5vw, 18px);
  color: #fff;
  background: #ffffff0d;
  border: 2px solid #9B30FF55;
  border-radius: 8px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.2s;
  letter-spacing: 1px;
}

.name-input::placeholder { color: #555; }
.name-input:focus { border-color: #9B30FF; }

/* ── Launch button ── */
.start-btn {
  width: 100%;
  font-family: 'Courier New', monospace;
  font-size: clamp(15px, 4vw, 22px);
  color: #fff;
  letter-spacing: 3px;
  background: #9B30FF;
  border: none;
  border-radius: 40px;
  padding: 14px 36px;
  cursor: pointer;
  box-shadow: 0 0 24px #9B30FF88;
  transition: transform 0.15s;
}

.start-btn:disabled { opacity: 0.7; cursor: default; }
.start-btn:not(:disabled):active { transform: scale(0.97); }

.start-btn.pulse {
  animation: pulse-btn 1.2s ease-in-out infinite;
}

@keyframes pulse-btn {
  0%, 100% { box-shadow: 0 0 24px #9B30FF88; transform: scale(1); }
  50% { box-shadow: 0 0 48px #9B30FFcc; transform: scale(1.04); }
}

/* ── Field guide shared ── */
.field-section {
  margin-bottom: 22px;
}

.field-section-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #cc44ff;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* ── THREATS ── */
.threats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.threat-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 12px 8px 10px;
}

.threat-silhouette {
  width: 72px;
  height: 44px;
  border-radius: 6px;
}

.threat-silhouette--common {
  background: #333;
  border: 2px solid #666;
}

.threat-silhouette--rare {
  background: #2a1a1a;
  border: 2px solid #ff4444;
}

.threat-silhouette--swarm {
  width: 72px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
  padding: 4px;
}

.swarm-dot {
  display: block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff6600;
  border: 1px solid #ff9944;
  box-shadow: 0 0 6px #ff660088;
}

.threat-silhouette--boss {
  width: 88px;
  height: 52px;
  background: #222;
  border: 2px solid #ff0000;
  box-shadow: 0 0 10px #ff000044;
}

.threat-label {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 10px);
  color: #aaa;
  text-align: center;
  letter-spacing: 0.5px;
}

.threat-label--boss {
  color: #ff4444;
  font-weight: bold;
}

.threat-rarity-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  font-family: 'Courier New', monospace;
  font-size: 8px;
  font-weight: bold;
  color: #ff4444;
  border: 1px solid #ff444466;
  border-radius: 4px;
  padding: 1px 4px;
  background: rgba(255,68,68,0.1);
  letter-spacing: 1px;
}

/* ── VALUES ── */
.values-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.value-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-left: 3px solid;
  border-radius: 8px;
  padding: 8px 10px;
}

.value-card-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.value-card-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.value-card-name {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 11px);
  color: #ddd;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value-card-effect {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2vw, 11px);
  color: #666;
  line-height: 1.3;
}

/* ── Controls (HOW TO PLAY tab) ── */
.controls-block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #ffffff08;
  border: 1px solid #ffffff11;
  border-radius: 10px;
  padding: 14px 16px;
}

.control-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.control-keys {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  min-width: 160px;
}

.key {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  font-weight: bold;
  color: #ddd;
  background: #333;
  border: 1px solid #555;
  border-bottom: 2px solid #222;
  border-radius: 4px;
  padding: 3px 6px;
  display: inline-block;
  min-width: 22px;
  text-align: center;
}

.key--wide { min-width: 44px; }

.key-sep {
  font-family: 'Courier New', monospace;
  font-size: 10px;
  color: #555;
  margin: 0 2px;
}

.control-desc {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.5vw, 12px);
  color: #888;
}

/* ── Tutorial ── */
.tutorial-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tutorial-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 10px 12px;
}

.tutorial-item--boss {
  border-color: rgba(255,153,0,0.25);
  background: rgba(255,153,0,0.05);
}

.tutorial-icon {
  font-size: 18px;
  flex-shrink: 0;
  line-height: 1.3;
}

.tutorial-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tutorial-heading {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.5vw, 12px);
  font-weight: bold;
  color: #ddd;
  letter-spacing: 0.5px;
}

.tutorial-item--boss .tutorial-heading { color: #ff9900; }

.tutorial-body {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.2vw, 10px);
  color: #666;
  line-height: 1.5;
}

/* ── Mobile ── */
@media (max-width: 400px) {
  .threats-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: 1fr; }
}
</style>
