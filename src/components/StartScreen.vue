<template>
  <div class="start-screen">
    <div class="start-content">
      <div class="start-logo">👾</div>
      <h1 class="start-title">Purple Overdrive</h1>
      <p class="start-subtitle">A-Team Surge</p>
      <p class="start-tagline">3 Minutes. 3 Levels. One Team.</p>

      <div class="start-mission">
        <p>Overcome the challenges threatening the A-Team.</p>
        <p>Collect values, build your team, and survive all three levels to achieve mission success.</p>
      </div>

      <!-- THREATS field guide -->
      <div class="field-section">
        <div class="field-section-title">THREATS</div>
        <div class="threats-grid">
          <div class="threat-card threat-common">
            <div class="threat-silhouette threat-silhouette--common"></div>
            <span class="threat-label">⚠ Workplace Challenge</span>
          </div>
          <div class="threat-card threat-rare">
            <div class="threat-silhouette threat-silhouette--rare"></div>
            <span class="threat-label">★ Difficult Threat</span>
            <span class="threat-rarity-badge">Difficult</span>
          </div>
          <div class="threat-card threat-swarm">
            <div class="threat-silhouette threat-silhouette--swarm">
              <span class="swarm-dot"></span>
              <span class="swarm-dot"></span>
              <span class="swarm-dot"></span>
              <span class="swarm-dot"></span>
              <span class="swarm-dot"></span>
            </div>
            <span class="threat-label">🔔 Notification Swarm</span>
          </div>
          <div class="threat-card threat-boss">
            <div class="threat-silhouette threat-silhouette--boss"></div>
            <span class="threat-label threat-label--boss">⚠ THE UNKNOWN FUTURE</span>
          </div>
        </div>
      </div>

      <!-- VALUES field guide -->
      <div class="field-section">
        <div class="field-section-title">VALUES</div>
        <div class="values-grid">
          <div
            v-for="v in valueGuide"
            :key="v.key"
            class="value-card"
            :style="{ borderLeftColor: v.cssColor }"
          >
            <span class="value-card-icon">{{ v.icon }}</span>
            <div class="value-card-info">
              <span class="value-card-name">{{ v.name }}</span>
              <span class="value-card-effect">{{ v.effect }}</span>
            </div>
          </div>
        </div>
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

      <div class="controls-section">
        <div class="controls-title">CONTROLS</div>
        <div class="controls-grid">
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
              <span class="key wide">Auto</span>
            </div>
            <span class="control-desc">Fire — stay near enemies</span>
          </div>
          <div class="control-row">
            <div class="control-keys">
              <span class="key wide">Touch</span>
            </div>
            <span class="control-desc">Drag to move on mobile</span>
          </div>
        </div>
      </div>

      <button
        class="start-btn"
        :class="{ pulse: !tapped }"
        :disabled="tapped"
        @click="handleStart"
      >
        {{ tapped ? 'Get Ready...' : 'LAUNCH MISSION' }}
      </button>
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

const valueGuide = [
  { key: 'innovation', icon: POWERUP_TYPES.innovation.label, name: POWERUP_TYPES.innovation.name, effect: POWERUP_TYPES.innovation.effect, cssColor: '#ffcc00' },
  { key: 'kindness',   icon: POWERUP_TYPES.kindness.label,   name: POWERUP_TYPES.kindness.name,   effect: POWERUP_TYPES.kindness.effect,   cssColor: '#44ff88' },
  { key: 'teammate',   icon: POWERUP_TYPES.teammate.label,   name: POWERUP_TYPES.teammate.name,   effect: POWERUP_TYPES.teammate.effect,   cssColor: '#ff44cc' },
  { key: 'integrity',  icon: POWERUP_TYPES.integrity.label,  name: POWERUP_TYPES.integrity.name,  effect: POWERUP_TYPES.integrity.effect,  cssColor: '#4488ff' },
  { key: 'excellence', icon: POWERUP_TYPES.excellence.label, name: POWERUP_TYPES.excellence.name, effect: POWERUP_TYPES.excellence.effect, cssColor: '#ffdd00' },
  { key: 'passion',    icon: POWERUP_TYPES.passion.label,    name: POWERUP_TYPES.passion.name,    effect: POWERUP_TYPES.passion.effect,    cssColor: '#ff4444' },
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

.start-mission {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  color: #aaa;
  line-height: 1.6;
  margin-bottom: 22px;
  border: 1px solid #9B30FF33;
  border-radius: 10px;
  padding: 12px 16px;
  background: #9B30FF0a;
}

.start-mission p { margin: 0 0 4px; }
.start-mission p:last-child { margin-bottom: 0; }

/* ── Field guide shared ── */
.field-section {
  margin-bottom: 22px;
  text-align: left;
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
  grid-template-columns: 1fr 1fr 1fr;
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
  font-size: 20px;
  flex-shrink: 0;
  line-height: 1;
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
  font-size: clamp(8px, 1.8vw, 9px);
  color: #666;
  line-height: 1.3;
}

/* ── Name input ── */
.name-section {
  margin-bottom: 20px;
  text-align: left;
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

/* ── Controls ── */
.controls-section {
  margin-bottom: 20px;
  text-align: left;
  background: #ffffff08;
  border: 1px solid #ffffff11;
  border-radius: 10px;
  padding: 14px 16px;
}

.controls-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #cc44ff;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.controls-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.key.wide { min-width: 44px; }

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

/* ── Launch button ── */
.start-btn {
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

/* ── Mobile: collapse values to 2 columns ── */
@media (max-width: 400px) {
  .threats-grid { grid-template-columns: 1fr; }
  .values-grid { grid-template-columns: 1fr 1fr; }
}
</style>
