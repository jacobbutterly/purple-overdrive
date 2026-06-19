export const COLORS = {
  player: 0x9B30FF,
  playerGlow: 0xcc66ff,
  enemyFill: 0x333333,
  enemyStroke: 0x666666,
  enemyText: '#ffffff',
  projectile: 0x00ffff,
  teammate: 0xff44cc,
  kindness: 0x44ff88,
  innovation: 0xffcc00,
  integrity: 0x4488ff,
  passion: 0xff4444,
  excellence: 0xffdd00,
  teamwork: 0xff44cc,
  boss: 0x222222,
  bossStroke: 0xff0000,

  // Level palettes (background hex strings for CSS)
  level1Bg: 0x111111,
  level2Bg: 0x1a0a2e,
  level3Bg: 0x0d0020,

  // Accent per level
  level1Accent: 0x666666,
  level2Accent: 0xcc44ff,
  level3Accent: 0xff44cc,
}

export const TIMING = {
  gameDuration: 180,       // 3 minutes in seconds
  level2Start: 60,         // remaining time at which level 2 begins (120s elapsed)
  level3Start: 120,        // remaining time at which level 3 begins (60s elapsed)
  disruptionStart: 90,     // remaining time for disruption (90s elapsed = 1:30)
  disruptionDuration: 15,
  bossSpawn: 15,           // remaining time for boss (165s elapsed = 2:45)
  excellenceStreakTime: 15, // seconds without damage for streak
  passionHealthThreshold: 20,
  passionDuration: 5,
}

export const PLAYER = {
  radius: 18,
  speed: 220,
  fireRate: 600,           // ms between shots (base)
  passionSpeedMult: 2,
  passionFireRateMult: 0.5, // multiplier on delay (lower = faster)
}

export const ENEMY_TYPES = {
  unreadInbox:      { label: 'Unread\nInbox',              level: 1, w: 90,  h: 55,  hp: 2,   speed: 55,  score: 10   },
  spreadsheet:      { label: 'Spread-\nsheet',             level: 1, w: 95,  h: 55,  hp: 2,   speed: 45,  score: 10   },
  endlessMeeting:   { label: 'Endless\nMeeting',           level: 2, w: 120, h: 70,  hp: 5,   speed: 70,  score: 25   },
  siloMatrix:       { label: 'Silo\nMatrix',               level: 2, w: 115, h: 70,  hp: 5,   speed: 65,  score: 25   },
  scopeCreep:       { label: 'Scope\nCreep',               level: 3, w: 145, h: 85,  hp: 10,  speed: 90,  score: 50   },
  legacyRedTape:    { label: 'Legacy\nRed Tape',           level: 3, w: 150, h: 85,  hp: 10,  speed: 80,  score: 50   },
  theUnknownFuture: { label: 'The Unknown\nFuture',        level: 3, w: 200, h: 120, hp: 500, speed: 40,  score: 1000, isBoss: true },

  // Custom obstacles
  legacySpreadsheet: { label: 'Legacy Spreadsheet V3_FINAL_FINAL', level: 1, w: 120, h: 72,  hp: 20,  speed: 28,  score: 60,  isLegacy: true, isRare: true },
  todoFrom2014:      { label: '@TODO from 2014',                   level: 1, w: 110, h: 68,  hp: 16,  speed: 22,  score: 50,  isLegacy: true, isRare: true },
  githubOutage:      { label: 'GitHub\nOutage',                    level: 2, w: 140, h: 80,  hp: 18,  speed: 35,  score: 55  },
  llmFees:           { label: 'Increased\nLLM Fees 💸',           level: 2, w: 125, h: 72,  hp: 8,   speed: 60,  score: 45  },
  alwaysDns:         { label: "It's Always\nDNS",                 level: 1, w: 110, h: 65,  hp: 5,   speed: 80,  score: 35  },
  scopeChange:       { label: '4:55 PM\nScope\nChange',               level: 2, w: 105, h: 62,  hp: 3,   speed: 160, score: 40,  isErratic: true },
  notificationSpam:  { label: '🔔',                                   level: 2, w: 32,  h: 32,  hp: 1,   speed: 230, score: 8,   isSwarm: true },
  doubleBooked:      { label: '📅 Double\nBooked',                    level: 2, w: 88,  h: 58,  hp: 6,   speed: 42,  score: 80,  isLinked: true },
}

export const POWERUP_TYPES = {
  innovation: { color: 0xffcc00, label: 'AI',   size: 18 },
  kindness:   { color: 0x44ff88, label: '💚',   size: 18 },
  teammate:   { color: 0xff44cc, label: '👤',   size: 18 },
  integrity:  { color: 0x4488ff, label: '🛡',   size: 18 },
  excellence: { color: 0xffdd00, label: '⭐',   size: 18 },
}

export const COMIC_TEXTS = {
  unreadInbox:       ['Archived!', 'Unsubscribed!', 'Auto-replied!'],
  spreadsheet:       ['Automated!', 'Pivot That!', 'VLOOKUP\'d!'],
  endlessMeeting:    ['This could have been an email!', 'Calendar Cleared!', 'Declined!'],
  siloMatrix:        ['Silos Demolished!', 'Cross-functional!', 'Synergy!'],
  scopeCreep:        ['Scope Locked!', 'MVP Only!', 'Requirements Frozen!'],
  legacyRedTape:     ['Disrupted!', 'Modernized!', 'Agile Now!'],
  theUnknownFuture:  ['Future Proof!', 'We Are Ready!', 'What\'s Next?!'],
  legacySpreadsheet: ['Finally Deleted!', 'Data Liberated!', 'No More V4!'],
  todoFrom2014:      ['TODO: Done!', 'Resolved at Last!', 'Ten Years Late!'],
  scopeChange:       ['Scope Frozen!', 'Change Blocked!', 'Too Late!'],
  notificationSpam:  ['Muted!', 'Do Not Disturb!', 'Silenced!'],
  doubleBooked:      ['Calendar Cleared!', 'Both Declined!', 'Time Reclaimed!'],
  githubOutage:      ['Push Rejected!', 'Status: Degraded?', 'Back Online!'],
  llmFees:           ['Costs Cut!', 'Open Source FTW!', 'Budget Saved!'],
  alwaysDns:         ['Not DNS!', 'It Was DNS.', 'Resolved!'],
}
