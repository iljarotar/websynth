import { Module, Output, Param } from '../common'

export type NoiseConfig = {
  name: string
  amp: Param
  pan: Param
}

export class Noise implements Module {
  name: string
  amp: Param
  pan: Param
  current: Output

  constructor(config: NoiseConfig) {
    this.name = config.name
    this.amp = config.amp
    this.pan = config.pan
    this.current = { mono: 0, left: 0, right: 0 }
  }
}
