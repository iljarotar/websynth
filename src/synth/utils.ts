export function limit(x: number, min: number, max: number): number {
  let y = x

  if (y > min) y = Math.min(x, max)
  else y = min

  return y
}

export function percentage(x: number, min: number, max: number): number {
  return (x - min) / (max - min)
}

export function normalize(
  signal: Array<number>,
  min: number,
  max: number
): Array<number> {
  let [sigMin, sigMax] = [0, 0]

  for (let y of signal) {
    if (y > sigMax) {
      sigMax = y
      continue
    }
    if (y < sigMin) sigMin = y
  }

  for (let i in signal) {
    const y = signal[i]
    signal[i] = percentage(y, sigMin, sigMax) * (max - min) + min
  }

  return signal
}
