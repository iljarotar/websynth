import { OscillatorType } from './common'

export type SignalFunc = (x: number) => number

export function newSignalFunc(oscType: OscillatorType): SignalFunc {
  switch (oscType) {
    case OscillatorType.Sine:
      return SineSignalFunc()
    case OscillatorType.Square:
      return NoSignalFunc()
    case OscillatorType.Sawtooth:
      return NoSignalFunc()
    case OscillatorType.ReverseSawtooth:
      return NoSignalFunc()
    case OscillatorType.Triangle:
      return NoSignalFunc()
    default:
      return NoSignalFunc()
  }
}

function NoSignalFunc(): SignalFunc {
  return (t: number) => t
}

function SineSignalFunc(): SignalFunc {
  return (t: number) => Math.sin(t)
}
