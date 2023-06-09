import { BehaviorSubject, finalize, Subscription, tap } from 'rxjs'
import { store } from '../store/store'
import { sampleRate } from './config'
import { Synth } from './synth'

export class Control {
  private static instance: Control | null = null

  t = 0
  synth?: Synth
  ctx: AudioContext
  buffer: [left: number[], right: number[]]
  audioNodeSubject = new BehaviorSubject<AudioWorkletNode | undefined>(
    undefined
  )
  audioNode?: AudioWorkletNode
  playing?: Subscription

  private constructor() {
    this.ctx = new window.AudioContext({ sampleRate })
    this.buffer = this.getNewBuffer()
    this.init()
    store.synth.current.subscribe((synth) => (this.synth = synth))
  }

  public static getInstance() {
    return this.instance ?? (this.instance = new this())
  }

  // TODO: is it necessary to close the AudioContext? If yes, when?
  public close() {
    this.ctx.close()
  }

  async init() {
    await this.ctx.audioWorklet.addModule('worklet/processor.js')
    const audioNode = new AudioWorkletNode(this.ctx, 'processor', {
      processorOptions: { buffer: this.buffer },
      numberOfOutputs: 1,
      outputChannelCount: [2],
    })
    this.buffer = this.getNewBuffer()

    audioNode.port.onmessage = () => {
      audioNode.port.postMessage(this.buffer)
      this.buffer = this.getNewBuffer()
    }

    this.audioNodeSubject.next(audioNode)
  }

  play() {
    this.playing = this.audioNodeSubject
      .pipe(
        tap((audioNode) => {
          this.audioNode = audioNode
          this.audioNode?.connect(this.ctx.destination)
        }),
        finalize(() => this.audioNode?.disconnect())
      )
      .subscribe()
  }

  stop() {
    if (this.playing) {
      this.playing.unsubscribe()
    }
  }

  getNewBuffer(): [leftBuffer: number[], rightBuffer: number[]] {
    const [leftBuffer, rightBuffer] = [new Array<number>(), new Array<number>()]

    for (let i = 0; i < 4096; i++) {
      const output = this.synth?.nextValue(this.t) ?? {
        mono: 0,
        left: 0,
        right: 0,
      }
      leftBuffer.push(output.left)
      rightBuffer.push(output.right)
      this.t += 1 / sampleRate
    }

    return [leftBuffer, rightBuffer]
  }
}
