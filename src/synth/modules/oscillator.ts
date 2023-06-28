import {
  Module,
  Output,
  Param,
  OscillatorType,
  ModuleMap,
  limits,
  stereo,
  modulate,
} from '../common'
import { newSignalFunc, SignalFunc } from '../signal-functions'
import { sampleRate } from '../config'
import { limit } from '../utils'

export type OscillatorConfig = {
  name: string
  type: OscillatorType
  freq: Param
  amp: Param
  pan: Param
  phase: number
}

export class Oscillator implements Module {
  name: string
  type: OscillatorType
  freq: Param
  amp: Param
  pan: Param
  phase: number
  integral: number
  current: Output
  signal: SignalFunc

  constructor(config: OscillatorConfig) {
    this.name = config.name
    this.type = config.type
    this.freq = config.freq
    this.amp = config.amp
    this.pan = config.pan
    this.phase = config.phase

    this.integral = 0
    this.current = { mono: 0, left: 0, right: 0 }
    this.signal = newSignalFunc(this.type)
    this.limitParams()

    const y = this.signalValue(0, this.amp.val, 0)
    this.current = stereo(y, this.pan.val)
  }

  next(t: number, moduleMap: ModuleMap) {
    const pan = limit(
      this.pan.val + modulate(this.pan.mod, moduleMap) * this.pan.modamp,
      limits.pan.low,
      limits.pan.high
    )
    const amp = limit(
      this.amp.val + modulate(this.amp.mod, moduleMap) * this.amp.modamp,
      limits.amp.low,
      limits.amp.high
    )
    const phaseOffset = this.getPhaseOffset(moduleMap)

    const y = this.signalValue(t, amp, phaseOffset)
    this.current = stereo(y, pan)
  }

  getPhaseOffset(moduleMap: ModuleMap): number {
    let y = 0

    for (let index of this.freq.mod) {
      const mod = moduleMap.get(index)
      if (mod) y += mod.integral
    }

    if (this.freq.mod.length > 0) y /= this.freq.mod.length

    return y * this.freq.modamp
  }

  signalValue(t: number, amp: number, phaseOffset: number): number {
    const shift = this.phase / this.freq.val // shift is a fraction of one period
    const phi = 2 * Math.PI * (this.freq.val * (t + shift) + phaseOffset)
    const y = this.signal(phi) * amp

    const avg = (y + this.current.mono) / 2
    this.integral += avg / sampleRate

    return y
  }

  limitParams() {
    this.amp.modamp = limit(this.amp.modamp, limits.mod.low, limits.mod.high)
    this.amp.val = limit(this.amp.val, limits.amp.low, limits.amp.high)

    this.phase = limit(this.phase, limits.phase.low, limits.phase.high)

    this.pan.modamp = limit(this.pan.modamp, limits.mod.low, limits.mod.high)
    this.pan.val = limit(this.pan.val, limits.pan.low, limits.pan.high)

    this.freq.modamp = limit(
      this.freq.modamp,
      limits.freq.low,
      limits.freq.high
    )
    this.freq.val = limit(this.freq.val, limits.freq.low, limits.freq.high)
  }
}
