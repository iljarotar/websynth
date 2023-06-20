import { Synth } from "./synth";

export class Control {
  synth: Synth
  ctx: AudioContext
  t = 0
  nextBuffer: Array<number>

  constructor() {
    this.synth = new Synth()
    this.ctx = new window.AudioContext()
    this.nextBuffer = this.newBuffer()
    this.init()
  }

  async init() {
    await this.ctx.audioWorklet.addModule('worklet/processor.js')
    const audioNode = new AudioWorkletNode(this.ctx, "processor", { processorOptions: { buffer: this.nextBuffer } })
    this.nextBuffer = this.newBuffer()
    audioNode.connect(this.ctx.destination)
    audioNode.port.onmessage = m => {
      if (m.data === 'next') {
        audioNode.port.postMessage(this.nextBuffer)
        this.nextBuffer = this.newBuffer()
      }
    }
  }

  play() {
  }

  newBuffer(): Array<number> {
    const buffer = new Array<number>()

    for (let i = 0; i < 4096; i++) {
      buffer.push(Math.sin(2 * Math.PI * this.t * 400.5))
      this.t += 1 / this.ctx.sampleRate
    }

    return buffer
  }
}