import { Custom, CustomMap } from "./module/custom"
import { Noise, NoiseMap } from "./module/noise"
import { Oscillator, OscillatorsMap } from "./module/oscillator"

export class Synth {
  volume: number
  out: Array<string>
  oscillators: Array<Oscillator>
  noise: Array<Noise>
  custom: Array<Custom>
  oscMap: Map<string, Oscillator>
  noiseMap: Map<string, Noise>
  customMap: Map<string, Custom>

  constructor() {
    this.volume = 0
    this.out = []
    this.oscillators = []
    this.noise = new Array<Noise>()
    this.custom = new Array<Custom>()

    this.oscMap = this.makeOscillatorsMap()
    this.noiseMap = this.makeNoiseMap()
    this.customMap = this.makeCustomMap()
  }

  nextValue(t: number): number {
    let y = 0

    for (let o of this.out) {
      const osc = this.oscMap.get(o)
      if (osc) {
        osc.next(t)
        y += osc.current.mono
      }
    }

    return y
  }

  makeOscillatorsMap(): OscillatorsMap {
    const oscMap = new Map<string, Oscillator>()

    for (let osc of this.oscillators) oscMap.set(osc.name, osc)

    return oscMap
  }

  makeNoiseMap(): NoiseMap {
    const noiseMap = new Map<string, Noise>()

    for (let noise of this.noise) noiseMap.set(noise.name, noise)

    return noiseMap
  }

  makeCustomMap(): CustomMap {
    const customMap = new Map<string, Custom>()

    for (let custom of this.custom) customMap.set(custom.name, custom)

    return customMap
  }
}