import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult
} from 'apollo-boost';

// We need this to prevent state updates on drag
export class PauseResponseLink extends ApolloLink {
  private onResume: Promise<void> = Promise.resolve();

  private _resume: () => void = () => null;

  public resume() {
    this._resume();
  }

  public pause() {
    this.onResume = new Promise(resolve => {
      this._resume = resolve;
    });
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      forward(operation).subscribe({
        next: result => this.onResume.then(() => observer.next(result)),
        complete: () => this.onResume.then(() => observer.complete()),
        error: err => observer.error(err)
      });
    });
  }
}
