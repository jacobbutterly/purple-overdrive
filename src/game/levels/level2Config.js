import { ENEMY_TYPES } from '../constants.js'

export const level2Config = {
  bgColor: 0x1a0a2e,
  accentColor: 0xcc44ff,
  spawnInterval: 1600,
  maxEnemies: 14,
  enemyPool: ENEMY_TYPES.filter(e => e.level <= 2),
  powerupInterval: 6000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'integrity', 'excellence', 'passion'],
  musicBPM: 110,
}
