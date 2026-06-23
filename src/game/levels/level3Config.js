import { ENEMY_TYPES } from '../constants.js'

const LEVEL3_ENEMY_NAMES = [
  'scopeCreep', 'legacyRedTape', 'endlessMeeting', 'siloMatrix',
  'scopeChange', 'notificationSpam', 'doubleBooked', 'githubOutage', 'llmFees', 'alwaysDns',
]

export const level3Config = {
  bgColor: 0x0d0020,
  accentColor: 0xff44cc,
  spawnInterval: 1000,
  maxEnemies: 22,
  enemyPool: ENEMY_TYPES.filter(e => LEVEL3_ENEMY_NAMES.includes(e.name)),
  powerupInterval: 5000,
  powerupPool: ['innovation', 'kindness', 'teammate', 'integrity', 'excellence', 'passion'],
  musicBPM: 140,
}
