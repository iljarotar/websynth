import { Output, Param } from './common'
import { newSignalFunc, SignalFunc } from './signal-functions'

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

  constructor(name: string) {
    this.name = name
    this.type = OscillatorType.Sine
    this.freq = {}
    this.amp = {}
    this.pan = {}
    this.phase = 0
    this.integral = 0
    this.current = { mono: 0, left: 0, right: 0 }
    this.signal = newSignalFunc(this.type)
  }

  next(t: number) {
    this.current.mono = this.signal(2 * Math.PI * t * 200.1)
  }
}

export enum OscillatorType {
  Sine = 'Sine',
  Triangle = 'Triangle',
  Square = 'Square',
  Sawtooth = 'Sawtooth',
  ReverseSawtooth = 'ReverseSawtooth',
}

export type OscillatorsMap = Map<string, Oscillator>
