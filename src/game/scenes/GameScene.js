import Phaser from 'phaser'
import { gameState, resetGameState } from '../../gameState.js'
import { COLORS, TIMING, PLAYER, ENEMY_TYPES, POWERUP_TYPES } from '../constants.js'
import { JoystickSystem } from '../systems/JoystickSystem.js'
import { AudioSystem } from '../systems/AudioSystem.js'
import { level1Config } from '../levels/level1Config.js'
import { level2Config } from '../levels/level2Config.js'
import { level3Config } from '../levels/level3Config.js'

const LEVEL_CONFIGS = [null, level1Config, level2Config, level3Config]

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' })
  }

  preload() {
    const base = import.meta.env.BASE_URL
    this.load.image('powerup_innovation', `${base}assets/images/innovation.png`)
    this.load.image('powerup_kindness',   `${base}assets/images/kindness.png`)
    this.load.image('powerup_teammate',   `${base}assets/images/teamwork.png`)
    this.load.image('powerup_integrity',  `${base}assets/images/integrity.png`)
    this.load.image('powerup_excellence', `${base}assets/images/excellence.png`)
    this.load.image('powerup_passion',    `${base}assets/images/passion.png`)
  }

  create() {
    this.W = this.scale.width
    this.H = this.scale.height

    resetGameState()

    this.audio = new AudioSystem()
    this.audio.init()
    this.audio.resume()

    this._setupBackground()
    this._setupPlayer()
    this._setupGroups()
    this._setupJoystick()
    this._setupTimers()

    this.audio.startMusic(level1Config.musicBPM)

    // Game timer
    this.elapsedTime = 0
    this.gameRunning = true

    // Excellence streak tracking
    this.timeSinceLastHit = 0
    this.streakChecked2x = false
    this.streakChecked3x = false
    this.streakChecked4x = false
    this.streakChecked5x = false

    // Overclock mode
    this.overclockTimer = 0
    this.overclockActive = false

    // Passion mode
    this.passionTimer = 0
    this.passionActive = false

    // Disruption state
    this.disruptionTimer = 0
    this.disruptionTriggered = false

    // Boss state
    this.bossSpawned = false
    this.bossEntity = null

    // Weapon / fire tracking
    this.fireTimer = 0
    this.currentFireRate = PLAYER.fireRate

    // Level transition flag
    this.currentLevelConfig = level1Config
    this.bgColorTarget = level1Config.bgColor

    // Teammate orbiting
    this.teammates = []
    this.teammateAngle = 0

    // Border flash graphics
    this.borderGfx = this.add.graphics()
    this.borderGfx.setDepth(100)

    // Disruption overlay
    this.disruptionOverlay = this.add.graphics()
    this.disruptionOverlay.setDepth(90)
    this.disruptionOverlay.setAlpha(0)

    // Particle group for confetti
    this.confettiGraphics = []

    // Comic text pool
    this.comicTexts = []

    // Keyboard pause
    this.input.keyboard.on('keydown-ESC', () => this._togglePause())
    this.input.keyboard.on('keydown-P', () => this._togglePause())
  }

  _togglePause() {
    if (!this.gameRunning) return
    gameState.paused = !gameState.paused
    if (gameState.paused) {
      this.audio.stopMusic()
    } else {
      this.audio.startMusic(this.currentLevelConfig.musicBPM)
    }
  }

  _setupBackground() {
    this.bgGraphics = this.add.graphics()
    this.bgGraphics.setDepth(-10)
    this._drawBackground(level1Config.bgColor)
  }

  _drawBackground(color) {
    this.bgGraphics.clear()
    this.bgGraphics.fillStyle(color, 1)
    this.bgGraphics.fillRect(0, 0, this.W, this.H)
  }

  _setupPlayer() {
    this.player = {
      x: this.W / 2,
      y: this.H / 2,
      radius: PLAYER.radius,
      gfx: this.add.graphics(),
      shield: false,
    }
    this.player.gfx.setDepth(9)

    this.player.emoji = this.add.text(this.W / 2, this.H / 2, '👾', {
      fontSize: '36px',
    }).setOrigin(0.5).setDepth(10)

    this._drawPlayer()
  }

  _drawPlayer() {
    const g = this.player.gfx
    g.clear()

    // Glow ring underneath emoji
    g.fillStyle(COLORS.playerGlow, 0.18)
    g.fillCircle(this.player.x, this.player.y, this.player.radius + 14)
    g.fillStyle(COLORS.playerGlow, 0.12)
    g.fillCircle(this.player.x, this.player.y, this.player.radius + 22)

    // Passion border
    if (this.passionActive) {
      g.lineStyle(3, 0xff0000, 0.85)
      g.strokeCircle(this.player.x, this.player.y, this.player.radius + 6)
    }

    // Integrity shield visual — layered pulsing rings
    if (gameState.hasIntegrity) {
      const pulse = 0.55 + 0.3 * Math.sin(this.time.now * 0.004)
      // Faint dome fill
      g.fillStyle(COLORS.integrity, 0.07)
      g.fillCircle(this.player.x, this.player.y, this.player.radius + 24)
      // Outer ring
      g.lineStyle(3, COLORS.integrity, pulse * 0.75)
      g.strokeCircle(this.player.x, this.player.y, this.player.radius + 24)
      // Inner ring
      g.lineStyle(4, COLORS.integrity, pulse)
      g.strokeCircle(this.player.x, this.player.y, this.player.radius + 14)
    }

    // Sync emoji position and facing direction
    this.player.emoji.setPosition(this.player.x, this.player.y)
    this.player.emoji.setScale(this.playerFacingLeft ? -1 : 1, 1)
  }

  _setupGroups() {
    this.enemies = []
    this.projectiles = []
    this.powerups = []
    this.ripples = []
    this.chainGfx = this.add.graphics()
    this.chainGfx.setDepth(4)
  }

  _setupJoystick() {
    this.joystick = new JoystickSystem(this)
  }

  _setupTimers() {
    // Enemy spawn
    this.spawnTimer = 0
    this.powerupTimer = 0
    this.spawnInterval = level1Config.spawnInterval
    this.powerupInterval = level1Config.powerupInterval
  }

  update(time, delta) {
    if (!this.gameRunning) return
    if (gameState.paused) return

    // Restart music if player chose to keep fighting
    if (gameState.continueMode && !this._continueMusicRestarted) {
      this._continueMusicRestarted = true
      this.audio.startMusic(this.currentLevelConfig.musicBPM)
    }

    const dt = delta / 1000

    this.elapsedTime += dt
    const remaining = gameState.continueMode ? 0 : Math.max(0, TIMING.gameDuration - this.elapsedTime)
    gameState.timeRemaining = Math.ceil(remaining)

    // Level transitions
    this._checkLevelTransition(remaining)

    // Timers
    this.spawnTimer += delta
    this.powerupTimer += delta
    this.fireTimer += delta
    this.timeSinceLastHit += dt

    if (this.passionActive) {
      this.passionTimer -= dt
      if (this.passionTimer <= 0) this._endPassion()
    }

    if (this.disruptionActive) {
      this.disruptionTimer -= dt
      if (this.disruptionTimer <= 0) this._endDisruption()
    }

    if (this.overclockActive) {
      this.overclockTimer -= dt
      if (this.overclockTimer <= 0) {
        this.overclockActive = false
        this._showFloatingText(this.player.x, this.player.y - 40, 'Overclock Ended', 0xffcc00)
      }
    }

    // Spawn
    if (this.spawnTimer >= this.currentLevelConfig.spawnInterval) {
      this.spawnTimer = 0
      this._spawnEnemy()
    }
    if (this.powerupTimer >= this.currentLevelConfig.powerupInterval) {
      this.powerupTimer = 0
      this._spawnPowerup()
    }

    // Movement
    this._movePlayer(dt)

    // Teammates orbit
    this._updateTeammates(dt)

    // Auto fire
    let effectiveFireRate = this.passionActive
      ? this.currentFireRate * PLAYER.passionFireRateMult
      : this.currentFireRate
    if (this.overclockActive) effectiveFireRate *= 0.4
    if (this.fireTimer >= effectiveFireRate && gameState.disruptionType !== 'noweapon') {
      this.fireTimer = 0
      this._autoFire()
    }

    // Move projectiles
    this._moveProjectiles(dt)

    // Move enemies
    this._moveEnemies(dt)

    // Move powerups (float)
    this._updatePowerups(dt)
    this._updateRipples(dt)
    this._drawChains()

    // Collisions
    this._checkProjectileEnemyCollisions()
    this._checkPlayerEnemyCollisions()
    this._checkPlayerPowerupCollisions()

    // Excellence streak
    this._checkExcellenceStreak()

    // Passion auto-trigger
    if (gameState.health < TIMING.passionHealthThreshold && !this.passionActive && !this._passionUsed) {
      this._triggerPassion()
    }

    // Redraw player
    this._drawPlayer()

    // Clean up confetti
    this._updateConfetti(dt)

    // Redraw border flash
    this._updateBorderFlash()

    // End requested from continue screen
    if (gameState.endRequested) {
      gameState.endRequested = false
      this._endGame()
      return
    }

    // Timer expired — show continue prompt unless already in survival mode
    if (remaining <= 0 && !gameState.continueMode) {
      gameState.paused = true
      gameState.phase = 'continue'
      this.audio.stopMusic()
    }
  }

  _checkLevelTransition(remaining) {
    const elapsed = TIMING.gameDuration - remaining

    if (elapsed >= 60 && gameState.level === 1) {
      this._setLevel(2)
    } else if (elapsed >= 120 && gameState.level === 2) {
      this._setLevel(3)
    }

    // Market disruption at 1:30 (90s elapsed)
    if (elapsed >= 90 && !this.disruptionTriggered) {
      this.disruptionTriggered = true
      this._triggerDisruption()
    }

    // Boss at 2:45 (165s elapsed)
    if (elapsed >= 165 && !this.bossSpawned) {
      this.bossSpawned = true
      this._spawnBoss()
    }
  }

  _setLevel(n) {
    gameState.level = n
    const cfg = LEVEL_CONFIGS[n]
    this.currentLevelConfig = cfg
    this.spawnTimer = 0
    this.powerupTimer = 0

    this._drawBackground(cfg.bgColor)
    this.audio.setBPM(cfg.musicBPM)
    this.audio.sfxLevelUp()

    // Flash screen white briefly
    const flash = this.add.graphics()
    flash.fillStyle(0xffffff, 0.4)
    flash.fillRect(0, 0, this.W, this.H)
    flash.setDepth(95)
    this.tweens.add({ targets: flash, alpha: 0, duration: 400, onComplete: () => flash.destroy() })
  }

  _triggerDisruption() {
    if (gameState.hasIntegrity) return // Integrity shields from disruption

    const type = Math.random() < 0.5 ? 'inverted' : 'noweapon'
    gameState.disruptionActive = true
    gameState.disruptionType = type
    this.disruptionActive = true
    this.disruptionTimer = TIMING.disruptionDuration

    if (type === 'inverted') this.joystick.setInverted(true)

    this.audio.sfxDisruption()

    // Show disruption overlay text
    this._showDisruptionBanner(type)
  }

  _showDisruptionBanner(type) {
    const label = type === 'inverted' ? '⚠ MARKET DISRUPTION!\nControls Inverted!' : '⚠ MARKET DISRUPTION!\nCloud Outage — No Weapons!'
    const bg = this.add.graphics()
    bg.fillStyle(0xff0000, 0.7)
    bg.fillRect(0, this.H / 2 - 60, this.W, 120)
    bg.setDepth(88)

    const txt = this.add.text(this.W / 2, this.H / 2, label, {
      fontFamily: 'Courier New',
      fontSize: Math.min(this.W * 0.05, 22) + 'px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(89)

    this.tweens.add({
      targets: [bg, txt], alpha: 0, delay: 2500, duration: 500,
      onComplete: () => { bg.destroy(); txt.destroy() }
    })
  }

  _endDisruption() {
    this.disruptionActive = false
    gameState.disruptionActive = false
    gameState.disruptionType = null
    this.joystick.setInverted(false)
  }

  _triggerPassion() {
    this._passionUsed = true
    this.passionActive = true
    gameState.passionActive = true
    this.passionTimer = TIMING.passionDuration
    this.audio.sfxPassion()

    // Flash border red
    this._passionFlashActive = true
  }

  _endPassion() {
    this.passionActive = false
    gameState.passionActive = false
    this._passionFlashActive = false
    this._passionUsed = false // reset so it can re-trigger if health dips again
  }

  _updateBorderFlash() {
    this.borderGfx.clear()
    if (this._passionFlashActive) {
      const alpha = 0.4 + 0.3 * Math.sin(this.elapsedTime * 10)
      this.borderGfx.lineStyle(12, 0xff0000, alpha)
      this.borderGfx.strokeRect(0, 0, this.W, this.H)
    }
  }

  _movePlayer(dt) {
    const speed = this.passionActive ? PLAYER.speed * PLAYER.passionSpeedMult : PLAYER.speed
    const { vx, vy } = this.joystick.getVelocity(speed)
    this.player.x = Phaser.Math.Clamp(this.player.x + vx * dt, this.player.radius, this.W - this.player.radius)
    this.player.y = Phaser.Math.Clamp(this.player.y + vy * dt, this.player.radius, this.H - this.player.radius)
    if (Math.abs(vx) > 10) this.playerFacingLeft = vx < 0
  }

  _updateTeammates(dt) {
    this.teammateAngle += dt * 1.5
    const count = this.teammates.length
    this.teammates.forEach((tm, i) => {
      const angle = this.teammateAngle + (i / count) * Math.PI * 2
      const orbitR = this.player.radius + 40 + i * 8
      tm.x = this.player.x + Math.cos(angle) * orbitR
      tm.y = this.player.y + Math.sin(angle) * orbitR

      // Draw teammate
      tm.gfx.clear()
      tm.gfx.fillStyle(COLORS.teammate, 0.9)
      tm.gfx.fillCircle(tm.x, tm.y, 10)
      tm.gfx.lineStyle(2, 0xffffff, 0.5)
      tm.gfx.strokeCircle(tm.x, tm.y, 10)

      // Teammate auto-fire
      tm.fireTimer = (tm.fireTimer || 0) + dt * 1000
      if (tm.fireTimer >= 900) {
        tm.fireTimer = 0
        this._fireFromPosition(tm.x, tm.y, COLORS.teammate, true)
      }
    })
  }

  _autoFire() {
    // Find nearest enemy
    let nearest = null
    let minDist = Infinity
    this.enemies.forEach(e => {
      const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
      if (d < minDist) { minDist = d; nearest = e }
    })

    if (gameState.weaponTier >= 2) {
      // LLM Cyclone — 8-directional burst
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        this._fireProjectile(this.player.x, this.player.y, Math.cos(angle) * 380, Math.sin(angle) * 380, COLORS.projectile, 1)
      }
    } else if (nearest) {
      const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, nearest.x, nearest.y)
      const speed = gameState.weaponTier >= 1 ? 520 : 360
      const dmg = gameState.weaponTier >= 1 ? 2 : 1
      this._fireProjectile(this.player.x, this.player.y, Math.cos(angle) * speed, Math.sin(angle) * speed, COLORS.projectile, dmg)
    }

    // Diffusion shield — damage aura
    if (gameState.weaponTier >= 3) {
      this.enemies.forEach(e => {
        const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
        if (d < 80) {
          e.hp -= 1
          if (e.hp <= 0) this._killEnemy(e)
        }
      })
    }

    this.audio.sfxShoot()
  }

  _fireFromPosition(x, y, color, isTeammate) {
    let nearest = null
    let minDist = Infinity
    this.enemies.forEach(e => {
      const d = Phaser.Math.Distance.Between(x, y, e.x, e.y)
      if (d < minDist) { minDist = d; nearest = e }
    })
    if (!nearest) return
    const angle = Phaser.Math.Angle.Between(x, y, nearest.x, nearest.y)
    this._fireProjectile(x, y, Math.cos(angle) * 320, Math.sin(angle) * 320, color, 1)
  }

  _fireProjectile(x, y, vx, vy, color, dmg) {
    const gfx = this.add.graphics()
    gfx.setDepth(8)
    gfx.fillStyle(color, 1)
    gfx.fillRect(-4, -2, 8, 4)
    gfx.x = x
    gfx.y = y

    this.projectiles.push({ x, y, vx, vy, gfx, dmg: dmg || 1, life: 2 })
  }

  _moveProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i]
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.life -= dt
      p.gfx.x = p.x
      p.gfx.y = p.y
      if (p.life <= 0 || p.x < -50 || p.x > this.W + 50 || p.y < -50 || p.y > this.H + 50) {
        p.gfx.destroy()
        this.projectiles.splice(i, 1)
      }
    }
  }

  _pickEnemyDef(pool) {
    let def = pool[Math.floor(Math.random() * pool.length)]
    if (def.isRare && Math.random() < 0.8) {
      const commonPool = pool.filter(d => !d.isRare)
      if (commonPool.length > 0) def = commonPool[Math.floor(Math.random() * commonPool.length)]
    }
    return def
  }

  _spawnEnemy() {
    const cfg = this.currentLevelConfig
    if (this.enemies.length >= cfg.maxEnemies) return

    const def = this._pickEnemyDef(cfg.enemyPool)
    if (!def) return

    if (def.isSwarm) { this._spawnNotificationSwarm(); return }
    if (def.isLinked) { this._spawnLinkedPair(def); return }

    this._spawnSingleEnemy(def)
  }

  _edgeSpawnPos(def) {
    const side = Math.floor(Math.random() * 4)
    if (side === 0) return { x: Math.random() * this.W, y: -def.h }
    if (side === 1) return { x: this.W + def.w, y: Math.random() * this.H }
    if (side === 2) return { x: Math.random() * this.W, y: this.H + def.h }
    return { x: -def.w, y: Math.random() * this.H }
  }

  _makeEnemy(def, x, y, extra = {}) {
    const gfx = this.add.graphics()
    gfx.setDepth(5)
    const textStyle = {
      fontFamily: 'Courier New',
      fontSize: Math.min(def.w * 0.18, 13) + 'px',
      color: COLORS.enemyText,
      align: 'center',
      wordWrap: { width: def.w - 10 },
    }
    const label = this.add.text(x, y, def.label, textStyle).setOrigin(0.5).setDepth(6)
    const enemy = {
      name: def.name, x, y,
      w: def.w, h: def.h,
      hp: def.hp, maxHp: def.hp,
      speed: def.speed, score: def.score,
      comicTexts: def.comicTexts,
      gfx, label,
      isBoss: !!def.isBoss,
      hitFlash: 0,
      ...extra,
    }
    this._drawEnemy(enemy)
    return enemy
  }

  _spawnSingleEnemy(def) {
    let x, y
    if (def.isErratic) {
      const margin = 80
      x = margin + Math.random() * (this.W - margin * 2)
      y = margin + Math.random() * (this.H - margin * 2)
    } else {
      const pos = this._edgeSpawnPos(def)
      x = pos.x; y = pos.y
    }
    const extra = def.isErratic ? { moveAngle: Math.random() * Math.PI * 2, moveTimer: 0 } : {}
    const enemy = this._makeEnemy(def, x, y, extra)
    this.enemies.push(enemy)
  }

  _spawnNotificationSwarm() {
    this.audio.sfxSlackNotification()
    const def = ENEMY_TYPES.find(e => e.name === 'notificationSpam')
    const count = 5 + Math.floor(Math.random() * 3)
    for (let i = 0; i < count; i++) {
      if (this.enemies.length >= this.currentLevelConfig.maxEnemies) break
      const angle = (i / count) * Math.PI * 2
      const ex = this.W / 2 + Math.cos(angle) * (this.W * 0.6)
      const ey = this.H / 2 + Math.sin(angle) * (this.H * 0.6)
      const enemy = this._makeEnemy(def, ex, ey)
      this.enemies.push(enemy)
    }
  }

  _spawnLinkedPair(def) {
    if (this.enemies.length + 2 > this.currentLevelConfig.maxEnemies) return
    const posA = this._edgeSpawnPos(def)
    const posB = {
      x: Phaser.Math.Clamp(posA.x + (Math.random() > 0.5 ? 160 : -160), -def.w, this.W + def.w),
      y: Phaser.Math.Clamp(posA.y + (Math.random() > 0.5 ? 100 : -100), -def.h, this.H + def.h),
    }
    const a = this._makeEnemy(def, posA.x, posA.y)
    const b = this._makeEnemy(def, posB.x, posB.y)
    a.linkedTo = b
    b.linkedTo = a
    this.enemies.push(a, b)
  }

  _drawEnemy(e) {
    const g = e.gfx
    g.clear()
    const isFlashing = e.hitFlash > 0

    if (e.name === 'notificationSpam') {
      g.fillStyle(isFlashing ? 0xffffff : 0xff6600, 1)
      g.fillCircle(e.x, e.y, e.w / 2)
      g.lineStyle(2, 0xff9944, 1)
      g.strokeCircle(e.x, e.y, e.w / 2)
      return
    }

    if (e.name === 'scopeChange') {
      const fill = isFlashing ? 0xffffff : 0xff4400
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      g.lineStyle(3, 0xff8800, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      // Warning stripes
      if (!isFlashing) {
        g.fillStyle(0xff8800, 0.3)
        for (let i = 0; i < 3; i++) {
          const sx = e.x - e.w / 2 + (i * e.w / 3)
          g.fillRect(sx, e.y - e.h / 2, e.w / 6, e.h)
        }
      }
      return
    }

    if (e.name === 'legacySpreadsheet' || e.name === 'todoFrom2014') {
      const isTodo = e.name === 'todoFrom2014'
      const fillColor  = isTodo ? 0x3a2e0a : 0x1a4a1a
      const accentColor = isTodo ? 0xcc9922 : 0x44aa44
      const fill = isFlashing ? 0xffffff : fillColor
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      g.lineStyle(2, accentColor, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      if (!isFlashing) {
        g.lineStyle(1, accentColor, 0.4)
        for (let row = 1; row < 3; row++) {
          const ly = e.y - e.h / 2 + (row * e.h / 3)
          g.lineBetween(e.x - e.w / 2 + 4, ly, e.x + e.w / 2 - 4, ly)
        }
        for (let col = 1; col < 4; col++) {
          const lx = e.x - e.w / 2 + (col * e.w / 4)
          g.lineBetween(lx, e.y - e.h / 2 + 4, lx, e.y + e.h / 2 - 4)
        }
      }
      const barW = e.w - 8
      const barH = 5
      const bx = e.x - barW / 2
      const by = e.y + e.h / 2 + 4
      const pct = e.hp / e.maxHp
      g.fillStyle(0x333333, 1)
      g.fillRect(bx, by, barW, barH)
      g.fillStyle(accentColor, 1)
      g.fillRect(bx, by, barW * pct, barH)
      return
    }

    if (e.name === 'githubOutage') {
      const fill = isFlashing ? 0xffffff : 0x3a0a0a
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      g.lineStyle(2, 0xcc2222, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      if (!isFlashing) {
        g.lineStyle(1, 0xcc2222, 0.35)
        const hw = e.w / 2, hh = e.h / 2
        g.lineBetween(e.x - hw + 6, e.y - hh + 6, e.x + hw - 6, e.y + hh - 6)
        g.lineBetween(e.x + hw - 6, e.y - hh + 6, e.x - hw + 6, e.y + hh - 6)
      }
      return
    }

    if (e.name === 'llmFees') {
      const fill = isFlashing ? 0xffffff : 0x3a2e00
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      g.lineStyle(2, 0xffcc00, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      if (!isFlashing) {
        g.fillStyle(0xffcc00, 0.18)
        const cols = 3, rows = 2
        const cw = e.w / cols, ch = e.h / rows
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            g.fillRect(e.x - e.w / 2 + c * cw + 2, e.y - e.h / 2 + r * ch + 2, cw - 4, ch - 4)
          }
        }
      }
      return
    }

    if (e.name === 'alwaysDns') {
      const fill = isFlashing ? 0xffffff : 0x0a2a2a
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      g.lineStyle(2, 0x00aaaa, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 6)
      if (!isFlashing) {
        g.lineStyle(1, 0x00aaaa, 0.4)
        g.lineBetween(e.x - e.w / 2 + 4, e.y, e.x + e.w / 2 - 4, e.y)
        g.fillStyle(0x00aaaa, 0.5)
        g.fillCircle(e.x, e.y, 5)
      }
      return
    }

    if (e.name === 'doubleBooked') {
      const fill = isFlashing ? 0xffffff : 0x1a3a5c
      g.fillStyle(fill, 1)
      g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 8)
      g.lineStyle(2, 0x4488ff, 1)
      g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 8)
      // Calendar header bar
      if (!isFlashing) {
        g.fillStyle(0x4488ff, 0.5)
        g.fillRect(e.x - e.w / 2 + 2, e.y - e.h / 2 + 2, e.w - 4, e.h * 0.28)
      }
      return
    }

    const fillColor = isFlashing ? 0xffffff : (e.isBoss ? COLORS.boss : COLORS.enemyFill)
    const strokeColor = e.isBoss ? COLORS.bossStroke : COLORS.enemyStroke
    g.fillStyle(fillColor, 1)
    g.fillRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 8)
    g.lineStyle(e.isBoss ? 3 : 2, strokeColor, 1)
    g.strokeRoundedRect(e.x - e.w / 2, e.y - e.h / 2, e.w, e.h, 8)

    if (e.isBoss && e.maxHp > 10) {
      const barW = e.w - 10
      const barH = 6
      const bx = e.x - barW / 2
      const by = e.y + e.h / 2 + 5
      const pct = e.hp / e.maxHp
      g.fillStyle(0x444444, 1)
      g.fillRect(bx, by, barW, barH)
      g.fillStyle(0xff4444, 1)
      g.fillRect(bx, by, barW * pct, barH)
    }
  }

  _moveEnemies(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]

      let angle
      if (e.name === 'scopeChange') {
        // Erratic: change direction every 0.4-0.8s, bias toward player
        e.moveTimer = (e.moveTimer || 0) + dt
        if (e.moveTimer > 0.4 + Math.random() * 0.4) {
          e.moveTimer = 0
          const toPlayer = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y)
          // 60% chance to lunge toward player, otherwise random
          e.moveAngle = Math.random() < 0.6
            ? toPlayer + (Math.random() - 0.5) * 1.2
            : Math.random() * Math.PI * 2
        }
        angle = e.moveAngle || 0
      } else {
        angle = Phaser.Math.Angle.Between(e.x, e.y, this.player.x, this.player.y)
      }

      e.x += Math.cos(angle) * e.speed * dt
      e.y += Math.sin(angle) * e.speed * dt
      e.label.x = e.x
      e.label.y = e.y
      if (e.hitFlash > 0) e.hitFlash -= dt

      if (e.name === 'alwaysDns') {
        const blink = 0.55 + 0.45 * Math.sin(this.elapsedTime * Math.PI * 2)
        e.gfx.setAlpha(blink)
        e.label.setAlpha(blink)
      }

      this._drawEnemy(e)
    }
  }

  _spawnPowerup() {
    const cfg = this.currentLevelConfig
    const typeKey = cfg.powerupPool[Math.floor(Math.random() * cfg.powerupPool.length)]
    const def = POWERUP_TYPES[typeKey]
    const margin = 60
    const x = margin + Math.random() * (this.W - margin * 2)
    const y = margin + Math.random() * (this.H - margin * 2)

    const gfx = this.add.graphics()
    gfx.setDepth(7)

    const img = this.add.image(x, y, `powerup_${typeKey}`)
      .setOrigin(0.5).setDepth(8).setDisplaySize(30, 30)

    const pu = { key: typeKey, x, y, size: def.size, color: def.color, gfx, img, angle: 0, life: 12, collected: false }
    this._drawPowerup(pu)
    this.powerups.push(pu)
    this.audio.sfxPowerupSpawn()
    this._spawnRipple(x, y, def.color)
  }

  _spawnRipple(x, y, color) {
    for (let i = 0; i < 3; i++) {
      const gfx = this.add.graphics()
      gfx.setDepth(6)
      this.ripples.push({ x, y, color, gfx, radius: 0, maxRadius: 60 + i * 20, alpha: 0.7, delay: i * 0.12, age: 0 })
    }
  }

  _updateRipples(dt) {
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i]
      r.age += dt
      if (r.age < r.delay) continue
      const t = (r.age - r.delay) / 0.7
      r.radius = r.maxRadius * Math.min(t, 1)
      r.alpha = 0.7 * (1 - Math.min(t, 1))
      r.gfx.clear()
      if (r.alpha > 0.01) {
        r.gfx.lineStyle(2, r.color, r.alpha)
        r.gfx.strokeCircle(r.x, r.y, r.radius)
      }
      if (t >= 1) {
        r.gfx.destroy()
        this.ripples.splice(i, 1)
      }
    }
  }

  _drawPowerup(pu) {
    const g = pu.gfx
    g.clear()
    const py = pu.y + (pu.bobOffset || 0)
    // Outer soft glow
    g.fillStyle(pu.color, 0.15)
    g.fillCircle(pu.x, py, pu.size + 14)
    // Inner lit background circle
    g.fillStyle(0xffffff, 0.18)
    g.fillCircle(pu.x, py, pu.size + 4)
    if (pu.img) pu.img.setPosition(pu.x, py)
  }

  _updatePowerups(dt) {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const pu = this.powerups[i]
      pu.angle += dt * 2
      pu.life -= dt
      pu.bobOffset = Math.sin(pu.angle) * 4
      this._drawPowerup(pu)
      if (pu.life <= 0 || pu.collected) {
        pu.gfx.destroy()
        if (pu.img) pu.img.destroy()
        this.powerups.splice(i, 1)
      }
    }
  }

  _checkProjectileEnemyCollisions() {
    for (let pi = this.projectiles.length - 1; pi >= 0; pi--) {
      const p = this.projectiles[pi]
      for (let ei = this.enemies.length - 1; ei >= 0; ei--) {
        const e = this.enemies[ei]
        if (
          p.x > e.x - e.w / 2 && p.x < e.x + e.w / 2 &&
          p.y > e.y - e.h / 2 && p.y < e.y + e.h / 2
        ) {
          e.hp -= p.dmg
          e.hitFlash = 0.1
          if (e.isBoss) gameState.bossHealth = Math.max(0, e.hp)
          p.gfx.destroy()
          this.projectiles.splice(pi, 1)
          if (e.hp <= 0) {
            this._killEnemy(e)
            this.enemies.splice(ei, 1)
          }
          break
        }
      }
    }
  }

  _checkPlayerEnemyCollisions() {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i]
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, e.x, e.y)
      if (dist < this.player.radius + Math.min(e.w, e.h) / 2) {
        // Take damage
        const dmg = e.isBoss ? 15 : 10
        gameState.health = Math.max(0, gameState.health - dmg)
        this.timeSinceLastHit = 0
        this.streakChecked2x = false
        this.streakChecked3x = false
        this.streakChecked4x = false
        this.streakChecked5x = false
        gameState.streakMultiplier = 1
        this.audio.sfxHit()

        // Screen shake
        this.cameras.main.shake(200, 0.012)

        // Push enemy away
        const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, e.x, e.y)
        e.x += Math.cos(angle) * 60
        e.y += Math.sin(angle) * 60

        if (gameState.health <= 0) {
          this._endGame()
          return
        }
      }
    }
  }

  _checkPlayerPowerupCollisions() {
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const pu = this.powerups[i]
      const puY = pu.y + (pu.bobOffset || 0)
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, pu.x, puY)
      if (dist < this.player.radius + pu.size + 4) {
        this._collectPowerup(pu)
        pu.collected = true
      }
    }
  }

  _collectPowerup(pu) {
    this.audio.sfxPowerup()

    const valueName = POWERUP_TYPES[pu.key]?.name
    if (valueName) this._showValueName(pu.x, pu.y, valueName, POWERUP_TYPES[pu.key].color)

    const countKey = pu.key === 'teammate' ? 'teamwork' : pu.key
    if (gameState.valuesCollected[countKey] !== undefined) {
      gameState.valuesCollected[countKey]++
    }

    switch (pu.key) {
      case 'innovation':
        if (gameState.weaponTier < 3) {
          gameState.weaponTier++
          this._showFloatingText(pu.x, pu.y + 36, this._weaponTierName(gameState.weaponTier), COLORS.innovation)
        } else {
          this._triggerOverclock()
          this._showFloatingText(pu.x, pu.y + 36, 'Overclock!', COLORS.innovation)
        }
        break
      case 'kindness':
        gameState.health = Math.min(100, gameState.health + 25)
        this._showFloatingText(pu.x, pu.y + 36, '+25 Capacity!', COLORS.kindness)
        break
      case 'teammate':
        if (gameState.teammateCount < 4) {
          gameState.teammateCount++
          this.teammates.push({ x: this.player.x, y: this.player.y, gfx: this.add.graphics(), fireTimer: 0 })
          this.teammates[this.teammates.length - 1].gfx.setDepth(9)
          this._showFloatingText(pu.x, pu.y + 36, 'Teammate Joined!', COLORS.teamwork)
        }
        break
      case 'integrity':
        gameState.hasIntegrity = true
        this._showFloatingText(pu.x, pu.y + 36, 'Integrity Shield!', COLORS.integrity)
        break
      case 'excellence':
        gameState.streakMultiplier = Math.min(5, gameState.streakMultiplier + 1)
        this._showFloatingText(pu.x, pu.y + 36, `${gameState.streakMultiplier}× excellence!`, COLORS.excellence)
        break
      case 'passion':
        this._triggerPassion()
        this._showFloatingText(pu.x, pu.y + 36, 'Passion!', COLORS.passion)
        break
    }
  }

  _showValueName(x, y, name, color) {
    const colorHex = '#' + color.toString(16).padStart(6, '0')
    const fontSize = Math.min(this.W * 0.055, 28)
    const txt = this.add.text(x, y, name.toUpperCase(), {
      fontFamily: 'Courier New',
      fontSize: fontSize + 'px',
      fontStyle: 'bold',
      color: colorHex,
      stroke: '#000000',
      strokeThickness: 5,
      align: 'center',
    }).setOrigin(0.5).setDepth(60)

    this.tweens.add({
      targets: txt,
      y: y - 80,
      alpha: 0,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 1600,
      ease: 'Power2',
      onComplete: () => txt.destroy(),
    })
  }

  _weaponTierName(tier) {
    const names = ['Basic Shot', 'Prompt Laser!', 'LLM Cyclone!', 'Diffusion Shield!']
    return names[tier] || 'Max Power!'
  }

  _killEnemy(e) {
    const pts = e.score * gameState.streakMultiplier
    gameState.score += pts

    // Comic text
    const lines = e.comicTexts || ['Eliminated!']
    const txt = lines[Math.floor(Math.random() * lines.length)]
    this._showFloatingText(e.x, e.y - 20, txt, 0xffffff, true)

    // Confetti burst
    this._spawnConfetti(e.x, e.y, 24)

    this.audio.sfxExplosion()

    e.gfx.destroy()
    e.label.destroy()

    // Free linked partner — it becomes a solo faster enemy
    if (e.linkedTo) {
      e.linkedTo.linkedTo = null
      e.linkedTo.speed = Math.min(e.linkedTo.speed * 1.5, 140)
      this._showFloatingText(e.linkedTo.x, e.linkedTo.y - 20, 'Unchained!', 0x4488ff)
    }

    if (e.isBoss) {
      gameState.bossDefeated = true
      gameState.bossActive = false
      this._showBossDefeatedBanner()
      this.time.delayedCall(2200, () => this._endGame(true))
    }
  }

  _drawChains() {
    this.chainGfx.clear()
    for (const e of this.enemies) {
      if (e.linkedTo && e.linkedTo.x > e.x) {
        // Only draw once per pair (the one with smaller x draws it)
        this.chainGfx.lineStyle(3, 0x4488ff, 0.7)
        this.chainGfx.lineBetween(e.x, e.y, e.linkedTo.x, e.linkedTo.y)
        // Chain links (dots along the line)
        const steps = 5
        for (let i = 1; i < steps; i++) {
          const t = i / steps
          const cx = e.x + (e.linkedTo.x - e.x) * t
          const cy = e.y + (e.linkedTo.y - e.y) * t
          this.chainGfx.fillStyle(0x4488ff, 0.9)
          this.chainGfx.fillCircle(cx, cy, 4)
        }
      }
    }
  }

  _spawnConfetti(cx, cy, count) {
    const confettiColors = [0xff44cc, 0x44ffcc, 0xffdd00, 0x9B30FF, 0xff4444, 0x44ff88]
    for (let i = 0; i < count; i++) {
      const gfx = this.add.graphics()
      gfx.setDepth(50)
      const color = confettiColors[Math.floor(Math.random() * confettiColors.length)]
      gfx.fillStyle(color, 1)
      gfx.fillRect(0, 0, 6, 6)
      gfx.x = cx
      gfx.y = cy

      const vx = (Math.random() - 0.5) * 280
      const vy = (Math.random() - 0.7) * 280
      this.confettiGraphics.push({ gfx, x: cx, y: cy, vx, vy, life: 1.2, maxLife: 1.2 })
    }
  }

  _updateConfetti(dt) {
    for (let i = this.confettiGraphics.length - 1; i >= 0; i--) {
      const c = this.confettiGraphics[i]
      c.x += c.vx * dt
      c.y += c.vy * dt
      c.vy += 200 * dt // gravity
      c.life -= dt
      c.gfx.x = c.x
      c.gfx.y = c.y
      c.gfx.setAlpha(c.life / c.maxLife)
      if (c.life <= 0) {
        c.gfx.destroy()
        this.confettiGraphics.splice(i, 1)
      }
    }
  }

  _showFloatingText(x, y, text, color, isComic) {
    const colorHex = '#' + color.toString(16).padStart(6, '0')
    const txt = this.add.text(x, y, text, {
      fontFamily: 'Courier New',
      fontSize: isComic ? Math.min(this.W * 0.045, 18) + 'px' : Math.min(this.W * 0.035, 14) + 'px',
      color: colorHex,
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5).setDepth(55)

    this.tweens.add({
      targets: txt,
      y: y - 60,
      alpha: 0,
      duration: isComic ? 1800 : 1200,
      ease: 'Power1',
      onComplete: () => txt.destroy(),
    })
  }

  _checkExcellenceStreak() {
    if (this.timeSinceLastHit >= TIMING.excellenceStreakTime && !this.streakChecked2x) {
      this.streakChecked2x = true
      gameState.streakMultiplier = Math.max(gameState.streakMultiplier, 2)
      gameState.bestStreak = Math.max(gameState.bestStreak, 2)
    }
    if (this.timeSinceLastHit >= TIMING.excellenceStreakTime * 2 && !this.streakChecked3x) {
      this.streakChecked3x = true
      gameState.streakMultiplier = Math.max(gameState.streakMultiplier, 3)
      gameState.bestStreak = Math.max(gameState.bestStreak, 3)
    }
    if (this.timeSinceLastHit >= 45 && !this.streakChecked4x) {
      this.streakChecked4x = true
      gameState.streakMultiplier = Math.max(gameState.streakMultiplier, 4)
      gameState.bestStreak = Math.max(gameState.bestStreak, 4)
      this._showFloatingText(this.player.x, this.player.y - 50, '4× excellence!', COLORS.excellence)
    }
    if (this.timeSinceLastHit >= 60 && !this.streakChecked5x) {
      this.streakChecked5x = true
      gameState.streakMultiplier = Math.max(gameState.streakMultiplier, 5)
      gameState.bestStreak = Math.max(gameState.bestStreak, 5)
      this._showFloatingText(this.player.x, this.player.y - 50, '5× excellence! UNSTOPPABLE!', COLORS.excellence)
    }
  }

  _triggerOverclock() {
    this.overclockTimer = 4
    this.overclockActive = true
    this.audio.sfxLevelUp()
  }

  _spawnBoss() {
    const def = ENEMY_TYPES.find(e => e.name === 'theUnknownFuture')
    const x = this.W / 2
    const y = -def.h

    const gfx = this.add.graphics()
    gfx.setDepth(5)

    const label = this.add.text(x, y, def.label, {
      fontFamily: 'Courier New',
      fontSize: '16px',
      color: '#ff4444',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5).setDepth(6)

    const boss = {
      name: 'theUnknownFuture',
      x, y,
      w: def.w, h: def.h,
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      score: def.score,
      comicTexts: def.comicTexts,
      gfx, label,
      isBoss: true,
      hitFlash: 0,
    }

    this.enemies.push(boss)
    gameState.bossActive = true
    gameState.bossHealth = def.hp
    gameState.bossMaxHealth = def.hp

    this.bossEntity = boss

    // Boss announcement
    const bg = this.add.graphics()
    bg.fillStyle(0xff0000, 0.7)
    bg.fillRect(0, this.H / 2 - 55, this.W, 110)
    bg.setDepth(88)
    const txt = this.add.text(this.W / 2, this.H / 2, '⚠ THE UNKNOWN FUTURE APPROACHES!', {
      fontFamily: 'Courier New',
      fontSize: Math.min(this.W * 0.048, 20) + 'px',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setDepth(89)

    this.tweens.add({
      targets: [bg, txt], alpha: 0, delay: 2500, duration: 500,
      onComplete: () => { bg.destroy(); txt.destroy() }
    })

    this.audio.sfxDisruption()
  }

  _showBossDefeatedBanner() {
    this.audio.sfxVictory()
    this._spawnConfetti(this.W / 2, this.H / 2, 60)

    const bg = this.add.graphics()
    bg.fillStyle(0xffd700, 0.85)
    bg.fillRect(0, this.H / 2 - 65, this.W, 130)
    bg.setDepth(92)

    const txt = this.add.text(this.W / 2, this.H / 2, '🏆 THE UNKNOWN FUTURE DEFEATED!\nMISSION ACCOMPLISHED!', {
      fontFamily: 'Courier New',
      fontSize: Math.min(this.W * 0.048, 20) + 'px',
      color: '#000000',
      align: 'center',
      stroke: '#ffffff',
      strokeThickness: 2,
    }).setOrigin(0.5).setDepth(93)

    this.tweens.add({
      targets: [bg, txt], alpha: 0, delay: 1800, duration: 400,
      onComplete: () => { bg.destroy(); txt.destroy() },
    })
  }

  _endGame(forceVictory = false) {
    if (!this.gameRunning) return
    this.gameRunning = false
    this.audio.stopMusic()

    const survived = forceVictory || gameState.victory || gameState.health > 0
    gameState.victory = survived

    if (survived) {
      this.audio.sfxVictory()
    } else {
      this.audio.sfxLevelUp()
    }

    this.cameras.main.fade(1000, 0, 0, 0, false, (cam, progress) => {
      if (progress >= 1) {
        gameState.phase = 'gameover'
      }
    })
  }

  destroy() {
    this.joystick.destroy()
    this.audio.destroy()
  }
}
