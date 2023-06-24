import { Output, Param, OscillatorType } from '../common'
import { newSignalFunc, SignalFunc } from '../signal-functions'

export type OscillatorConfig = {
  name: string
  type: OscillatorType
  freq: Param
  amp: Param
  pan: Param
  phase: number
}

export class Oscillator {
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
  }

  next(t: number) {
    this.current.mono =
      this.signal(2 * Math.PI * t * this.freq.val) * this.amp.val
  }
}

export type OscillatorsMap = Map<string, Oscillator>
