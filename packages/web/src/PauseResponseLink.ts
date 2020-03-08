import {
  ApolloLink,
  Operation,
  NextLink,
  Observable,
  FetchResult
} from 'apollo-boost';

function delayed<T>(value: T, delay: Promise<void>): Promise<T> {
  return new Promise(resolve => {
    delay.then(() => resolve(value));
  });
}
// We need this to prevent state updates on drag
export class PauseResponseLink extends ApolloLink {
  private onOpen: Promise<void> = Promise.resolve();

  public open: () => void = () => null;

  public close() {
    this.onOpen = new Promise(resolve => {
      this.open = resolve;
    });
  }

  request(operation: Operation, forward: NextLink): Observable<FetchResult> {
    return new Observable(observer => {
      forward(operation).subscribe({
        next: result => {
          delayed(result, this.onOpen).then(observer.next.bind(observer));
        },
        error: observer.error.bind(observer),
        complete: () => {
          this.onOpen.then(() =>
            setTimeout(() => {
              observer.complete.bind(observer);
            }, 1000)
          );
        }
      });
    });
  }
}
