export class Noise {
  name: string

  constructor() {
    this.name = ''
  }
}

export type NoiseMap = Map<string, Noise>