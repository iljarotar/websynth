import { useState } from "react";
import { Control } from "./synth/control";

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
        <h1 className="text-3xl font-bold underline">
          Synth
        </h1>
      </header>
      <button onClick={() => play()}>play</button>
      <button onClick={() => stop()}>stop</button>
    </div>
  );
}

export default App;
