import { BehaviorSubject, Observable } from 'rxjs'

export class State<T> {
  private current$ = new BehaviorSubject<T | undefined>(undefined)

  get current(): Observable<T | undefined> {
    return this.current$.asObservable()
  }

  update(newValue: T) {
    this.current$.next(newValue)
  }
}
