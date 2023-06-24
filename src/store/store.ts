import { Synth } from '../synth/synth'
import { State } from './state'

class Store {
  synth = new State<Synth>()
}

export const store = new Store()
