export class JoystickSystem {
  constructor(scene) {
    this.scene = scene
    this.active = false
    this.originX = 0
    this.originY = 0
    this.deltaX = 0
    this.deltaY = 0
    this.maxRadius = 80
    this.inverted = false
    this.keys = {}
    this._setupListeners()
    this._setupKeyboard()
  }

  _setupListeners() {
    const s = this.scene
    s.input.on('pointerdown', (p) => {
      this.active = true
      this.originX = p.x
      this.originY = p.y
      this.deltaX = 0
      this.deltaY = 0
    })
    s.input.on('pointermove', (p) => {
      if (!this.active) return
      let dx = p.x - this.originX
      let dy = p.y - this.originY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > this.maxRadius) {
        dx = (dx / dist) * this.maxRadius
        dy = (dy / dist) * this.maxRadius
      }
      this.deltaX = dx
      this.deltaY = dy
    })
    s.input.on('pointerup', () => {
      this.active = false
      this.deltaX = 0
      this.deltaY = 0
    })
  }

  _setupKeyboard() {
    const { KeyCodes } = Phaser.Input.Keyboard
    const s = this.scene
    this.keys = s.input.keyboard.addKeys({
      up: KeyCodes.UP,
      down: KeyCodes.DOWN,
      left: KeyCodes.LEFT,
      right: KeyCodes.RIGHT,
      w: KeyCodes.W,
      a: KeyCodes.A,
      s: KeyCodes.S,
      d: KeyCodes.D,
    })
  }

  _getKeyboardVelocity(speed) {
    const { up, down, left, right, w, a, s, d } = this.keys
    let kx = 0
    let ky = 0
    if (left.isDown || a.isDown) kx -= 1
    if (right.isDown || d.isDown) kx += 1
    if (up.isDown || w.isDown) ky -= 1
    if (down.isDown || s.isDown) ky += 1
    if (kx === 0 && ky === 0) return null
    const len = Math.sqrt(kx * kx + ky * ky)
    const sign = this.inverted ? -1 : 1
    return {
      vx: sign * (kx / len) * speed,
      vy: sign * (ky / len) * speed,
    }
  }

  getVelocity(speed) {
    const kv = this._getKeyboardVelocity(speed)
    if (kv) return kv

    if (!this.active || (this.deltaX === 0 && this.deltaY === 0)) {
      return { vx: 0, vy: 0 }
    }
    const dist = Math.sqrt(this.deltaX * this.deltaX + this.deltaY * this.deltaY)
    const norm = dist / this.maxRadius
    const sign = this.inverted ? -1 : 1
    return {
      vx: sign * (this.deltaX / dist) * speed * norm,
      vy: sign * (this.deltaY / dist) * speed * norm,
    }
  }

  setInverted(v) { this.inverted = v }

  destroy() {
    this.scene.input.off('pointerdown')
    this.scene.input.off('pointermove')
    this.scene.input.off('pointerup')
  }
}
