import { ENEMY_TYPES, POWERUP_TYPES } from '../constants.js'

export const level1Config = {
  bgColor: 0x111111,
  accentColor: 0x666666,
  spawnInterval: 2200,
  maxEnemies: 8,
  enemyPool: ['unreadInbox', 'spreadsheet', 'legacySpreadsheet', 'todoFrom2014', 'alwaysDns'],
  powerupInterval: 8000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'excellence'],
  musicBPM: 80,
}
