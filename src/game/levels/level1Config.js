import { ENEMY_TYPES } from '../constants.js'

const LEVEL1_ENEMY_NAMES = ['unreadInbox', 'spreadsheet', 'legacySpreadsheet', 'todoFrom2014', 'alwaysDns']

export const level1Config = {
  bgColor: 0x111111,
  accentColor: 0x666666,
  spawnInterval: 2200,
  maxEnemies: 8,
  enemyPool: ENEMY_TYPES.filter(e => LEVEL1_ENEMY_NAMES.includes(e.name)),
  powerupInterval: 8000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'excellence', 'passion'],
  musicBPM: 80,
}
