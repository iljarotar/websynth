import { synth } from "./synth/synth";

function App() {
  function play() {
    const s = new synth()
    s.play()
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
