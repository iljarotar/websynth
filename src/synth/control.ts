import { BehaviorSubject, finalize, Subscription, tap } from "rxjs";
import { Synth } from "./synth";

export class Control {
  t = 0
  synth: Synth
  ctx: AudioContext
  buffer: Array<number>
  audioNodeSubject = new BehaviorSubject<AudioWorkletNode | undefined>(undefined)
  audioNode?: AudioWorkletNode
  playing?: Subscription

  constructor() {
    this.synth = new Synth()
    this.ctx = new window.AudioContext()
    this.buffer = this.getNewBuffer()
    this.init()
  }

  async init() {
    await this.ctx.audioWorklet.addModule('worklet/processor.js')
    const audioNode = new AudioWorkletNode(this.ctx, "processor", { processorOptions: { buffer: this.buffer } })
    this.buffer = this.getNewBuffer()

    audioNode.port.onmessage = () => {
      audioNode.port.postMessage(this.buffer)
      this.buffer = this.getNewBuffer()
    }

    this.audioNodeSubject.next(audioNode)
  }

  play() {
    this.playing = this.audioNodeSubject.pipe(
      tap(audioNode => {
        this.audioNode = audioNode
        this.audioNode?.connect(this.ctx.destination)
      }),
      finalize(() => this.audioNode?.disconnect()),
    ).subscribe()
  }

  stop() {
    if (this.playing) {
      this.playing.unsubscribe()
    }
  }

  getNewBuffer(): Array<number> {
    const buffer = new Array<number>()

    for (let i = 0; i < 4096; i++) {
      buffer.push(Math.sin(2 * Math.PI * this.t * 400.5))
      this.t += 1 / this.ctx.sampleRate
    }

    return buffer
  }
}