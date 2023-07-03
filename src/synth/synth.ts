import { Module, ModuleMap, Output } from './common'
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
  moduleMap: ModuleMap

  constructor(config: SynthConfig) {
    this.volume = config.volume
    this.out = config.out
    this.oscillators = config.oscillators
    this.noise = config.noise
    this.custom = config.custom

    this.moduleMap = this.makeModuleMap(
      new Map<string, Module>(),
      this.oscillators
    )
    this.moduleMap = this.makeModuleMap(this.moduleMap, this.noise)
    this.moduleMap = this.makeModuleMap(this.moduleMap, this.custom)
  }

  nextValue(t: number): Output {
    this.updateValues(t)
    let output = { mono: 0, left: 0, right: 0 }

    for (let o of this.out) {
      const mod = this.moduleMap.get(o)
      if (mod) {
        output.mono += mod.current.mono
        output.left += mod.current.left
        output.right += mod.current.right
      }
    }

    return output
  }

  private updateValues(t: number) {
    for (let osc of this.oscillators) osc.next(t, this.moduleMap)
    for (let noise of this.noise) noise.next(this.moduleMap)
  }

  makeModuleMap(map: ModuleMap, modules: Array<Module>): ModuleMap {
    for (let mod of modules) map.set(mod.name, mod)
    return map
  }
}
