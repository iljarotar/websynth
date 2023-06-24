import { useState } from 'react'
import { store } from './store/store'
import { OscillatorType } from './synth/common'
import { Control } from './synth/control'
import { Oscillator } from './synth/modules/oscillator'
import { Synth } from './synth/synth'

store.synth.update(
  new Synth({
    volume: 1,
    out: ['o1'],
    oscillators: [
      new Oscillator({
        name: 'o1',
        type: OscillatorType.Sine,
        freq: { val: 200.1, mod: [], modamp: 0 },
        amp: { val: 1, mod: [], modamp: 0 },
        pan: { val: 0, mod: [], modamp: 0 },
        phase: 0,
      }),
    ],
    noise: [],
    custom: [],
  })
)

function App() {
  const [ctl, setCtl] = useState<Control | undefined>(undefined)

  function play() {
    if (!ctl) {
      const control = Control.getInstance()
      setCtl(control)
      control.play()
    } else ctl.play()
  }

  function stop() {
    ctl?.stop()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">Synth</h1>
      </header>
      <button onClick={() => play()}>play</button>
      <button onClick={() => stop()}>stop</button>
    </div>
  )
}

export default App
