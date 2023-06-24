import { Synth } from '../synth/synth'
import { State } from './State'

class Store {
  synth = new State<Synth>().current
}

export const store = new Store()
