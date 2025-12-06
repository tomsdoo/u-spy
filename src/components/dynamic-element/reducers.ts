type SimpleReducer<S = any, T = any> = (previousState: S) => T;

export function combineSimpleReducers<T = any, U = any>(reducers: SimpleReducer[]) {
  return function combinedReducer<T, U>(value: T) {
    return reducers.reduce((prev, reducer) => {
      return reducer(prev);
    }, value) as unknown as U;
  }
}
