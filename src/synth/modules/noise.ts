import {
  limits,
  modulate,
  Module,
  ModuleMap,
  Output,
  Param,
  stereo,
} from '../common'
import { limit } from '../utils'
import { sampleRate } from '../config'

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
  integral: number

  constructor(config: NoiseConfig) {
    this.name = config.name
    this.amp = config.amp
    this.pan = config.pan

    this.current = { mono: 0, left: 0, right: 0 }
    this.limitParams()
    const y = this.noise() * this.amp.val
    this.current = stereo(y, this.pan.val)

    const avg = y / 2
    this.integral = avg / sampleRate
  }

  next(moduleMap: ModuleMap) {
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

    this.current = stereo(this.noise() * amp, pan)
  }

  limitParams() {
    this.amp.modamp = limit(this.amp.modamp, limits.mod.low, limits.mod.high)
    this.amp.val = limit(this.amp.val, limits.amp.low, limits.amp.high)

    this.pan.modamp = limit(this.pan.modamp, limits.mod.low, limits.mod.high)
    this.pan.val = limit(this.pan.val, limits.pan.low, limits.pan.high)
  }

  noise(): number {
    return Math.random() * 2 - 1
  }
}
