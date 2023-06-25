import { Module, Output, Param } from '../common'

export type CustomConfig = {
  name: string
  data: Array<number>
  freq: Param
  amp: Param
  pan: Param
}

export class Custom implements Module {
  name: string
  data: Array<number>
  freq: Param
  amp: Param
  pan: Param
  integral: number
  current: Output

  constructor(config: CustomConfig) {
    this.name = ''
    this.data = config.data
    this.freq = config.freq
    this.amp = config.amp
    this.pan = config.pan
    this.integral = 0
    this.current = { mono: 0, left: 0, right: 0 }
  }
}
