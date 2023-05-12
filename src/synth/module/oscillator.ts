import { output, param, signalFunc } from "./common"

export class oscillator {
  name: string
  type: oscillatorType
  freq: param
  amp: param
  pan: param
  phase: number
  integral: number
  current: output
  signal: signalFunc

  constructor() {
    this.name = ""
    this.type = oscillatorType.Sine
    this.freq = {}
    this.amp = {}
    this.pan = {}
    this.phase = 0
    this.integral = 0
    this.current = {}
    this.signal = (_: number) => 0
  }


}

export enum oscillatorType {
  Sine = "Sine",
  Triangle = "Triangle",
  Square = "Square",
  Sawtooth = "Sawtooth",
  ReverseSawtooth = "ReverseSawtooth"
}

