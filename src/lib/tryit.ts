export function tryit<T, U = Error>(func: () => T): [T, U];
export function tryit<T, U = Error>(
  func: () => Promise<T> | PromiseLike<T>,
): Promise<[T, U]>;
export function tryit<T, U = Error>(
  promise: Promise<T> | PromiseLike<T>,
): Promise<[T, U]>;

export function tryit<T, U = Error>(promiseOrFunction: unknown): unknown {
  if (
    promiseOrFunction instanceof Promise ||
    "then" in (promiseOrFunction as PromiseLike<T>)
  ) {
    return (promiseOrFunction as Promise<T>)
      .then<[T, null]>((data) => [data, null])
      .catch<[undefined, U]>((err: any) => [undefined, err]);
  } else if (promiseOrFunction instanceof Function) {
    try {
      const result = promiseOrFunction();
      if (result instanceof Promise) {
        return tryit<T, U>(result);
      }

      return [result, null];
    } catch (err: any) {
      return [undefined, err];
    }
  } else {
    return [undefined, null];
  }
}

export default tryit;
