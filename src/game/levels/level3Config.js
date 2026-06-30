import { ENEMY_TYPES } from '../constants.js'

export const level3Config = {
  bgColor: 0x0d0020,
  accentColor: 0xff44cc,
  spawnInterval: 1000,
  maxEnemies: 22,
  enemyPool: ENEMY_TYPES.filter(e => e.level <= 3 && !e.isBoss),
  powerupInterval: 5000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'integrity', 'excellence', 'passion'],
  musicBPM: 140,
}
