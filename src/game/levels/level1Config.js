import { ENEMY_TYPES } from '../constants.js'

export const level1Config = {
  bgColor: 0x111111,
  accentColor: 0x666666,
  spawnInterval: 2200,
  maxEnemies: 8,
  enemyPool: ENEMY_TYPES.filter(e => e.level === 1),
  powerupInterval: 8000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'excellence', 'passion'],
  musicBPM: 80,
}
