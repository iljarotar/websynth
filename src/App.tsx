import { Control } from "./synth/control";

function App() {
  function play() {
    const ctl = new Control()
    ctl.play()
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">
          Synth
        </h1>
      </header>
      <button onClick={() => play()}>play</button>
    </div>
  );
}

export default App;
