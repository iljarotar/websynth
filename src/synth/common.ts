import { percentage } from './utils'

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

export interface Module {
  current: Output
}

export type ModuleMap = Map<string, Module>

export enum OscillatorType {
  Sine = 'Sine',
  Triangle = 'Triangle',
  Square = 'Square',
  Sawtooth = 'Sawtooth',
  ReverseSawtooth = 'ReverseSawtooth',
}

export const limits = new Map<string, Limits>([
  ['amp', { low: 0, high: 1 }],
  ['mod', { low: 0, high: 1 }],
  ['pan', { low: -1, high: 1 }],
  ['phase', { low: -1, high: 1 }],
  ['freq', { low: 0, high: 20000 }],
])

export function modulate(
  modulators: Array<string>,
  ...moduleMaps: ModuleMap[]
): number {
  let y = 0

  loop: for (let index of modulators) {
    for (let map of moduleMaps) {
      const mod = map.get(index)
      if (mod) {
        y += mod.current.mono
        continue loop
      }
    }
  }

  return y
}

export function stereo(x: number, pan: number): Output {
  const out = { mono: 0, left: 0, right: 0 }
  const p = percentage(pan, -1, 1)
  out.mono = x
  out.left = x * p
  out.right = x * (1 - p)

  return out
}
