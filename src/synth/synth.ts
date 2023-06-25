import { ModuleMap } from './common'
import { Custom } from './modules/custom'
import { Noise } from './modules/noise'
import { Oscillator } from './modules/oscillator'

export type SynthConfig = {
  volume: number
  out: Array<string>
  oscillators: Array<Oscillator>
  noise: Array<Noise>
  custom: Array<Custom>
}

export class Synth {
  volume: number
  out: Array<string>
  oscillators: Array<Oscillator>
  noise: Array<Noise>
  custom: Array<Custom>
  oscMap: ModuleMap
  noiseMap: ModuleMap
  customMap: ModuleMap

  constructor(config: SynthConfig) {
    this.volume = config.volume
    this.out = config.out
    this.oscillators = config.oscillators
    this.noise = config.noise
    this.custom = config.custom

    this.oscMap = this.makeOscillatorsMap()
    this.noiseMap = this.makeNoiseMap()
    this.customMap = this.makeCustomMap()
  }

  nextValue(t: number): number {
    this.updateValues(t)
    let y = 0

    for (let o of this.out) {
      const osc = this.oscMap.get(o)
      if (osc) {
        y += osc.current.mono
      }
    }

    return y
  }

  private updateValues(t: number) {
    for (let osc of this.oscillators) osc.next(t)
  }

  makeOscillatorsMap(): ModuleMap {
    const oscMap = new Map<string, Oscillator>()

    for (let osc of this.oscillators) oscMap.set(osc.name, osc)

    return oscMap
  }

  makeNoiseMap(): ModuleMap {
    const noiseMap = new Map<string, Noise>()

    for (let noise of this.noise) noiseMap.set(noise.name, noise)

    return noiseMap
  }

  makeCustomMap(): ModuleMap {
    const customMap = new Map<string, Custom>()

    for (let custom of this.custom) customMap.set(custom.name, custom)

    return customMap
  }
}
