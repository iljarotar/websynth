class Processor extends AudioWorkletProcessor {
  buffers = [[], []]
  tick = 0
  currentBuffer = 0

  constructor(options) {
    super();
    this.buffers[0] = options.processorOptions.buffer

    this.port.onmessage = m => {
      this.buffers[(this.currentBuffer + 1) % 2] = m.data
      this.currentBuffer = (this.currentBuffer + 1) % 2
    }
  }

  process(_, outputs) {
    const channel = outputs[0][0];
    for (let i = 0; i < channel.length; i++) {
      channel[i] = this.buffers[this.currentBuffer][this.tick++]

      if (this.tick === this.buffers[this.currentBuffer].length) {
        this.port.postMessage('next')
        this.tick = 0
      }
    }
    return true;
  }
}

registerProcessor("processor", Processor);
