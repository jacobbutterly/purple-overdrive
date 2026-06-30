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

export const ENEMY_TYPES = [
  // ── Common ───────────────────────────────────────────────────────────────
  {
    name: 'unreadInbox', label: 'Unread\nInbox', rarity: 'common',
    level: 1, w: 90, h: 55, hp: 2, speed: 55, score: 10,
    comicTexts: ['Archived!', 'Unsubscribed!', 'Auto-replied!'],
  },
  {
    name: 'spreadsheet', label: 'Spread-\nsheet', rarity: 'common',
    level: 1, w: 95, h: 55, hp: 2, speed: 45, score: 10,
    comicTexts: ['Automated!', 'Pivot That!', 'Data Liberated!'],
  },
  {
    name: 'jiraChasing', label: 'Jira\nChasing', rarity: 'common',
    level: 1, w: 95, h: 55, hp: 2, speed: 45, score: 10,
    comicTexts: ['Board Updated!', 'Correct Status!', 'Auto-Retroed!'],
  },
  {
    name: 'postmanRot', label: 'Postman\nRot', rarity: 'common',
    level: 1, w: 90, h: 55, hp: 2, speed: 65, score: 10,
    comicTexts: ['API Verified!', 'Repo Scanned!', 'Auto-Updated!'],
  },
  {
    name: 'manualOkrTracking', label: 'Manual OKR\nTracking', rarity: 'common',
    level: 1, w: 100, h: 55, hp: 2, speed: 50, score: 10,
    comicTexts: ['Auto-Tracked!', '100% Achieved!', 'Algorithmic Success!'],
  },
  {
    name: 'endlessMeeting', label: 'Endless\nMeeting', rarity: 'common',
    level: 2, w: 120, h: 70, hp: 5, speed: 70, score: 25,
    comicTexts: ['Gemini took the notes!', 'Calendar Cleared!', 'Declined!'],
  },
  {
    name: 'cloudSprawl', label: 'GCP Cloud\nSprawl', rarity: 'rare',
    level: 2, w: 125, h: 72, hp: 7, speed: 50, score: 45, isRare: true,
    comicTexts: ['Disks Purged!', '10TB lighter!', 'Budget Saved!'],
  },
  {
    name: 'outdatedStats', label: 'Outdated\nDeck Stats', rarity: 'common',
    level: 2, w: 115, h: 70, hp: 6, speed: 60, score: 25,
    comicTexts: ['Auto-Corrected!', 'Real-Time Retcon!', 'Fresh Data!'],
  },
  {
    name: 'scopeCreep', label: 'Scope\nCreep', rarity: 'common',
    level: 3, w: 145, h: 85, hp: 10, speed: 90, score: 50,
    comicTexts: ['Scope Locked!', 'MVP Only!', 'Requirements Frozen!'],
  },
  {
    name: 'legacyMonolith', label: 'Legacy\nMonolith', rarity: 'common',
    level: 3, w: 150, h: 85, hp: 12, speed: 75, score: 50,
    comicTexts: ['Migrated to AIR!', 'Onboarding Mentored!', 'Queue Mapped!'],
  },
  // ── Rare ─────────────────────────────────────────────────────────────────
  {
    name: 'legacySpreadsheet', label: 'Legacy Spreadsheet V3_FINAL_FINAL', rarity: 'rare',
    level: 1, w: 120, h: 72, hp: 20, speed: 28, score: 60, isLegacy: true, isRare: true,
    comicTexts: ['Finally Deleted!', 'Data Liberated!', 'No More V4!'],
  },
  {
    name: 'timeZoneManagement', label: 'Time Zone\nChaos', rarity: 'rare',
    level: 1, w: 110, h: 65, hp: 4, speed: 75, score: 30, isRare: true,
    comicTexts: ['Time Travel Active!', 'Jetlag Cured!', 'AI Synced!'],
  },
  {
    name: 'todoFrom2014', label: '@TODO from 2014', rarity: 'rare',
    level: 1, w: 110, h: 68, hp: 16, speed: 22, score: 50, isLegacy: true, isRare: true,
    comicTexts: ['TODO: Done!', 'Resolved at Last!', 'Ten Years Late!'],
  },
  {
    name: 'githubOutage', label: 'GitHub\nOutage', rarity: 'rare',
    level: 2, w: 140, h: 80, hp: 18, speed: 35, score: 55, isRare: true,
    comicTexts: ['Push Rejected!', 'Status: Degraded?', 'Back Online!'],
  },
  {
    name: 'customDeckBuilding', label: 'Custom Deck\nRequest', rarity: 'rare',
    level: 2, w: 130, h: 75, hp: 12, speed: 40, score: 65, isRare: true,
    comicTexts: ['Slides Generated!', 'Decks Dispatched!', 'Bullet Points Automated!'],
  },
  {
    name: 'llmFees', label: 'Increased\nLLM Fees 💸', rarity: 'rare',
    level: 2, w: 125, h: 72, hp: 8, speed: 60, score: 45, isRare: true,
    comicTexts: ['Costs Cut!', 'Open Source FTW!', 'Budget Saved!'],
  },
  {
    name: 'alwaysDns', label: "It's Always\nDNS", rarity: 'rare',
    level: 1, w: 110, h: 65, hp: 5, speed: 80, score: 35, isRare: true,
    comicTexts: ['Not DNS!', 'It Was DNS.', 'Resolved!'],
  },
  {
    name: 'scopeChange', label: '4:55 PM\nScope\nChange', rarity: 'rare',
    level: 2, w: 105, h: 62, hp: 3, speed: 160, score: 40, isErratic: true, isRare: true,
    comicTexts: ['Scope Frozen!', 'Change Blocked!', 'Too Late!'],
  },
  {
    name: 'notificationSpam', label: '#', rarity: 'rare',
    level: 2, w: 32, h: 32, hp: 1, speed: 230, score: 8, isSwarm: true, isRare: true,
    comicTexts: ['Muted!', 'Do Not Disturb!', 'Silenced!'],
  },
  {
    name: 'smsNotification', label: '💬', rarity: 'rare',
    level: 2, w: 38, h: 38, hp: 2, speed: 160, score: 20, isRare: true,
    comicTexts: ['Read!', 'Replied!', 'On Read!'],
  },
  {
    name: 'doubleBooked', label: '📅 Double\nBooked', rarity: 'rare',
    level: 2, w: 88, h: 58, hp: 6, speed: 42, score: 80, isLinked: true, isRare: true,
    comicTexts: ['Calendar Cleared!', 'Time Reclaimed!', 'Where was I?'],
  },
  {
    name: 'jargonDocumentation', label: 'Internal Jargon\nDocumentation', rarity: 'common',
    level: 3, w: 140, h: 85, hp: 12, speed: 85, score: 50,
    comicTexts: ['Translated to Human!', 'Plain Text Mode!'],
  },

  // ── Boss ─────────────────────────────────────────────────────────────────
  {
    name: 'theUnknownFuture', label: 'The Unknown\nFuture', rarity: 'boss',
    level: 3, w: 200, h: 120, hp: 500, speed: 40, score: 1000, isBoss: true,
    comicTexts: ['Future Proof!', 'We Are Ready!', "What's Next?!"],
  },
]

const _base = import.meta.env.BASE_URL
export const POWERUP_TYPES = {
  innovation: { color: 0xffcc00, label: '💡', size: 18, name: 'Innovation', effect: 'Upgrades your weapon',         image: `${_base}assets/images/innovation.png` },
  kindness:   { color: 0x44ff88, label: '💚', size: 18, name: 'Kindness',   effect: 'Restores +25 capacity',        image: `${_base}assets/images/kindness.png` },
  teammate:   { color: 0xff44cc, label: '👤', size: 18, name: 'Teamwork',   effect: 'Adds an orbiting teammate',    image: `${_base}assets/images/teamwork.png` },
  integrity:  { color: 0x4488ff, label: '💎', size: 18, name: 'Integrity',  effect: 'Grants an integrity shield',   image: `${_base}assets/images/integrity.png` },
  excellence: { color: 0xffdd00, label: '⭐', size: 18, name: 'excellence', effect: 'Boosts your score multiplier', image: `${_base}assets/images/excellence.png` },
  passion:    { color: 0xff4444, label: '🔥', size: 18, name: 'Passion',    effect: 'Triggers speed & fire boost',  image: `${_base}assets/images/passion.png` },
}
