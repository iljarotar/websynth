export type Param = {
  val: number
  mod: Array<string>
  modamp: number
}

export type Output = {
  mono: number
  left: number
  right: number
}

export type Limits = {
  high: number
  low: number
}

export const limits = new Map<string, Limits>([
  ['amp', { low: 0, high: 1 }],
  ['mod', { low: 0, high: 1 }],
  ['pan', { low: -1, high: 1 }],
  ['phase', { low: -1, high: 1 }],
  ['freq', { low: 0, high: 20000 }],
])

export enum OscillatorType {
  Sine = 'Sine',
  Triangle = 'Triangle',
  Square = 'Square',
  Sawtooth = 'Sawtooth',
  ReverseSawtooth = 'ReverseSawtooth',
}
