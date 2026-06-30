import { ENEMY_TYPES } from '../constants.js'

const LEVEL2_ENEMY_NAMES = [
  'unreadInbox', 'spreadsheet', 'endlessMeeting', 'siloMatrix',
  'legacySpreadsheet', 'todoFrom2014', 'scopeChange', 'notificationSpam',
  'doubleBooked', 'githubOutage', 'llmFees', 'alwaysDns',
]

export const level2Config = {
  bgColor: 0x1a0a2e,
  accentColor: 0xcc44ff,
  spawnInterval: 1600,
  maxEnemies: 14,
  enemyPool: ENEMY_TYPES.filter(e => LEVEL2_ENEMY_NAMES.includes(e.name)),
  powerupInterval: 6000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'integrity', 'excellence', 'passion'],
  musicBPM: 110,
}
