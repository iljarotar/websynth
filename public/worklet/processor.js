class Processor extends AudioWorkletProcessor {
  buffers = [
    [[], []],
    [[], []],
  ] // two buffers for two channels each
  tick = 0
  currentBuffer = 0

  constructor(options) {
    super()
    this.buffers[0] = options.processorOptions.buffer

    this.port.onmessage = (m) => {
      this.buffers[(this.currentBuffer + 1) % 2] = m.data
      this.currentBuffer = (this.currentBuffer + 1) % 2
    }
  }

  process(_, outputs) {
    const [left, right] = [outputs[0][0], outputs[0][1]]
    for (let i = 0; i < left.length; i++) {
      const buffer = this.buffers[this.currentBuffer]
      left[i] = buffer[0][this.tick]
      right[i] = buffer[1][this.tick++]

      if (this.tick >= buffer[0].length) {
        this.port.postMessage('next')
        this.tick = 0
      }
    }

    return true
  }
}

registerProcessor('processor', Processor)
