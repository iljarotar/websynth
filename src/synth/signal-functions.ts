import { OscillatorType } from './common'

export type SignalFunc = (x: number) => number

export function newSignalFunc(oscType: OscillatorType): SignalFunc {
  switch (oscType) {
    case OscillatorType.Sine:
      return SineSignalFunc()
    case OscillatorType.Square:
      return SquareSignalFunc()
    case OscillatorType.Sawtooth:
      return SawtoothSignalFunc()
    case OscillatorType.ReverseSawtooth:
      return ReverseSawtoothSignalFunc()
    case OscillatorType.Triangle:
      return TriangleSignalFunc()
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

function SquareSignalFunc(): SignalFunc {
  return (t: number) => {
    if (Math.sin(t) > 0) return 1
    return -1
  }
}

function TriangleSignalFunc(): SignalFunc {
  return (t: number) => {
    return (2 / Math.PI) * Math.asin(Math.sin(t))
  }
}

function SawtoothSignalFunc(): SignalFunc {
  return (t: number) => {
    return 2 * (t / (2 * Math.PI) - Math.floor(1 / 2 + t / (2 * Math.PI)))
  }
}

function ReverseSawtoothSignalFunc(): SignalFunc {
  return (t: number) => {
    return (
      1 - 2 * (t / (2 * Math.PI) - Math.floor(1 / 2 + t / (2 * Math.PI))) - 1
    )
  }
}
