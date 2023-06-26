import { Module, ModuleMap } from './common'
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

    this.oscMap = this.makeModuleMap(this.oscillators)
    this.noiseMap = this.makeModuleMap(this.noise)
    this.customMap = this.makeModuleMap(this.custom)
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

  makeModuleMap(modules: Array<Module>): ModuleMap {
    const map = new Map<string, Module>()

    for (let mod of modules) map.set(mod.name, mod)

    return map
  }
}
