<template>
  <div class="start-screen" @click="handleStart" @touchend.prevent="handleStart">
    <div class="start-content">
      <div class="start-logo">🟣</div>
      <h1 class="start-title">Purple Overdrive</h1>
      <p class="start-subtitle">A-Team Surge</p>
      <div class="start-tagline">Build. Scale. Survive.</div>
      <div class="start-timer-label">3 Minutes. 3 Levels. One Team.</div>

      <div class="start-values">
        <div class="value-chip">⚡ Innovation</div>
        <div class="value-chip">🏆 Excellence</div>
        <div class="value-chip">👥 Teamwork</div>
        <div class="value-chip">🛡 Integrity</div>
        <div class="value-chip">💚 Kindness</div>
        <div class="value-chip">🔥 Passion</div>
        <div class="value-chip">🎉 Fun</div>
      </div>

      <div class="start-cta" :class="{ pulse: !tapped }">
        {{ tapped ? 'Get Ready...' : 'TAP TO START' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['start'])
const tapped = ref(false)

function handleStart() {
  if (tapped.value) return
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
  cursor: pointer;
  touch-action: manipulation;
}

.start-content {
  text-align: center;
  padding: 24px 20px;
  max-width: 420px;
  width: 100%;
}

.start-logo {
  font-size: 56px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 20px #9B30FF);
}

.start-title {
  font-family: 'Courier New', monospace;
  font-size: clamp(26px, 7vw, 42px);
  color: #9B30FF;
  text-shadow: 0 0 20px #9B30FF, 0 0 40px #9B30FF88;
  margin: 0 0 4px;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.start-subtitle {
  font-family: 'Courier New', monospace;
  font-size: clamp(14px, 4vw, 20px);
  color: #ff44cc;
  text-shadow: 0 0 12px #ff44cc88;
  margin: 0 0 16px;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.start-tagline {
  font-family: 'Courier New', monospace;
  font-size: clamp(11px, 3vw, 14px);
  color: #aaa;
  margin-bottom: 4px;
}

.start-timer-label {
  font-family: 'Courier New', monospace;
  font-size: clamp(10px, 2.8vw, 13px);
  color: #666;
  margin-bottom: 24px;
}

.start-values {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 32px;
}

.value-chip {
  font-family: 'Courier New', monospace;
  font-size: clamp(9px, 2.5vw, 11px);
  color: #cc44ff;
  border: 1px solid #cc44ff44;
  border-radius: 20px;
  padding: 4px 10px;
  background: #cc44ff11;
}

.start-cta {
  font-family: 'Courier New', monospace;
  font-size: clamp(16px, 4.5vw, 24px);
  color: #fff;
  letter-spacing: 4px;
  background: #9B30FF;
  border-radius: 40px;
  padding: 14px 32px;
  display: inline-block;
  box-shadow: 0 0 24px #9B30FF88;
}

.start-cta.pulse {
  animation: pulse-cta 1.2s ease-in-out infinite;
}

@keyframes pulse-cta {
  0%, 100% { box-shadow: 0 0 24px #9B30FF88; transform: scale(1); }
  50% { box-shadow: 0 0 48px #9B30FFcc; transform: scale(1.04); }
}
</style>
