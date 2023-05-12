import { custom } from "./module/custom"
import { noise } from "./module/noise"
import { oscillator } from "./module/oscillator"

export class synth {
  volume: number
  out: Array<string>
  oscillators: Array<oscillator>
  noise: Array<noise>
  custom: Array<custom>
  t: number
  ctx: AudioContext

  constructor() {
    this.volume = 0
    this.out = new Array<string>()
    this.oscillators = new Array<oscillator>()
    this.noise = new Array<noise>()
    this.custom = new Array<custom>()
    this.t = 0
    this.ctx = new window.AudioContext()
  }

  play() {
    const buf = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate)

    const buffering = buf.getChannelData(0)
    for (let i = 0; i < buffering.length; i++) {
      buffering[i] = Math.sin(this.t * 2 * Math.PI * 200)
      this.t += 1 / this.ctx.sampleRate
    }

    const src = this.ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    src.connect(this.ctx.destination)
    src.start()
  }
}