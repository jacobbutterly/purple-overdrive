export class AudioSystem {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.musicGain = null
    this.sfxGain = null
    this.beatInterval = null
    this.currentBPM = 80
    this.running = false
    this.beat = 0
  }

  init() {
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)()
      this.masterGain = this.ctx.createGain()
      this.masterGain.gain.value = 0.4
      this.masterGain.connect(this.ctx.destination)

      this.musicGain = this.ctx.createGain()
      this.musicGain.gain.value = 0.6
      this.musicGain.connect(this.masterGain)

      this.sfxGain = this.ctx.createGain()
      this.sfxGain.gain.value = 0.8
      this.sfxGain.connect(this.masterGain)
    } catch (e) {
      console.warn('AudioContext unavailable')
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
  }

  startMusic(bpm) {
    this.stopMusic()
    this.currentBPM = bpm
    this.beat = 0
    this.running = true
    const beatMs = (60 / bpm) * 1000
    this.beatInterval = setInterval(() => this._tick(), beatMs)
  }

  setBPM(bpm) {
    if (bpm === this.currentBPM) return
    this.startMusic(bpm)
  }

  stopMusic() {
    this.running = false
    if (this.beatInterval) {
      clearInterval(this.beatInterval)
      this.beatInterval = null
    }
  }

  _tick() {
    if (!this.ctx) return
    this.beat++
    const now = this.ctx.currentTime
    const bpm = this.currentBPM

    // Bass kick on every beat
    this._playOsc(now, 80, 0.18, 0.12, 'sine', this.musicGain)

    // Hi-hat on off-beats at level 2+
    if (bpm >= 110 && this.beat % 2 === 0) {
      this._playNoise(now, 0.05, 0.08, 8000, this.musicGain)
    }

    // Synth arp at level 3
    if (bpm >= 140) {
      const notes = [220, 277, 330, 415]
      const freq = notes[this.beat % notes.length]
      this._playOsc(now, freq, 0.08, 0.18, 'sawtooth', this.musicGain)
    }

    // Sub bass pulse at level 2+
    if (bpm >= 110) {
      this._playOsc(now, 55, 0.1, 0.1, 'square', this.musicGain)
    }
  }

  _playOsc(when, freq, vol, dur, type, dest) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(vol, when)
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur)
    osc.connect(gain)
    gain.connect(dest || this.sfxGain)
    osc.start(when)
    osc.stop(when + dur)
  }

  _playNoise(when, vol, dur, cutoff, dest) {
    if (!this.ctx) return
    const bufSize = this.ctx.sampleRate * dur
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = cutoff
    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(vol, when)
    gain.gain.exponentialRampToValueAtTime(0.001, when + dur)
    src.connect(filter)
    filter.connect(gain)
    gain.connect(dest || this.sfxGain)
    src.start(when)
  }

  sfxShoot() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._playOsc(now, 880, 0.12, 0.06, 'sine', this.sfxGain)
  }

  sfxHit() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._playOsc(now, 120, 0.3, 0.15, 'square', this.sfxGain)
  }

  sfxExplosion() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._playNoise(now, 0.5, 0.3, 100, this.sfxGain)
  }

  sfxPowerupSpawn() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [330, 440, 554]
    notes.forEach((f, i) => {
      this._playOsc(now + i * 0.06, f, 0.07, 0.18, 'sine', this.sfxGain)
    })
  }

  sfxPowerup() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [523, 659, 784]
    notes.forEach((f, i) => {
      this._playOsc(now + i * 0.08, f, 0.15, 0.12, 'sine', this.sfxGain)
    })
  }

  sfxLevelUp() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    const notes = [392, 523, 659, 784, 1047]
    notes.forEach((f, i) => {
      this._playOsc(now + i * 0.1, f, 0.2, 0.15, 'sine', this.sfxGain)
    })
  }

  sfxDisruption() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._playOsc(now, 200, 0.4, 0.5, 'sawtooth', this.sfxGain)
    this._playOsc(now + 0.5, 150, 0.4, 0.5, 'sawtooth', this.sfxGain)
  }

  sfxSlackNotification() {
    const audio = new Audio('/assets/audio/slack.mp3')
    audio.volume = 0.6
    audio.play().catch(() => {})
  }

  sfxPassion() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    this._playOsc(now, 440, 0.35, 0.2, 'sawtooth', this.sfxGain)
    this._playOsc(now + 0.15, 660, 0.3, 0.2, 'sawtooth', this.sfxGain)
  }

  sfxVictory() {
    if (!this.ctx) return
    const now = this.ctx.currentTime
    // Triumphant ascending fanfare
    const melody = [523, 659, 784, 1047, 1319, 1047, 784, 1047, 1319]
    melody.forEach((f, i) => {
      this._playOsc(now + i * 0.12, f, 0.25, 0.2, 'sine', this.sfxGain)
    })
    // Bass hits
    ;[0, 0.36, 0.72].forEach(t => {
      this._playOsc(now + t, 130, 0.3, 0.18, 'square', this.sfxGain)
    })
    // Final chord
    ;[523, 659, 784, 1047].forEach(f => {
      this._playOsc(now + 1.1, f, 0.2, 0.6, 'sine', this.sfxGain)
    })
  }

  destroy() {
    this.stopMusic()
    if (this.ctx) this.ctx.close()
  }
}
