import { reactive } from 'vue'

export const gameState = reactive({
  phase: 'start', // 'start' | 'playing' | 'gameover'
  playerName: '',
  victory: false,
  score: 0,
  health: 100,
  level: 1,
  timeRemaining: 180,
  streakMultiplier: 1,
  bestStreak: 1,
  teammateCount: 0,
  weaponTier: 0, // 0=basic, 1=prompt laser, 2=llm cyclone, 3=diffusion shield
  hasIntegrity: false,
  passionActive: false,
  disruptionActive: false,
  disruptionType: null, // 'inverted' | 'noweapon'
  bossActive: false,
  bossHealth: 0,
  bossMaxHealth: 500,
  paused: false,
})

export function resetGameState() {
  gameState.phase = 'playing'
  gameState.victory = false
  gameState.score = 0
  gameState.health = 100
  gameState.level = 1
  gameState.timeRemaining = 180
  gameState.streakMultiplier = 1
  gameState.bestStreak = 1
  gameState.teammateCount = 0
  gameState.weaponTier = 0
  gameState.hasIntegrity = false
  gameState.passionActive = false
  gameState.disruptionActive = false
  gameState.disruptionType = null
  gameState.bossActive = false
  gameState.bossHealth = 0
  gameState.bossMaxHealth = 500
  gameState.paused = false
}
