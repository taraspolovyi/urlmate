import { Mapper } from '../types';

export function flow<T, S>(f1: Mapper<T, S>): Mapper<T, S>;
export function flow<T, S, A>(f1: Mapper<T, A>, f2: Mapper<A, S>): Mapper<T, S>;
export function flow<T, S, A, B>(f1: Mapper<T, A>, f2: Mapper<A, B>, f3: Mapper<B, S>): Mapper<T, S>;
export function flow<T, S, A, B>(f1: Mapper<T, A>, f2: Mapper<A, B>, f3: Mapper<B, S>): Mapper<T, S>;
export function flow<T, S, A, B, C>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, S>
): Mapper<T, S>;
export function flow<T, S, A, B, C, D>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, D>,
  f5: Mapper<D, S>
): Mapper<T, S>;
export function flow<T, S, A, B, C, D, E>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, D>,
  f5: Mapper<D, E>,
  f6: Mapper<E, S>
): Mapper<T, S>;
export function flow<T, S, A, B, C, D, E, F>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, D>,
  f5: Mapper<D, E>,
  f6: Mapper<E, F>,
  f7: Mapper<F, S>
): Mapper<T, S>;
export function flow<T, S, A, B, C, D, E, F, J>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, D>,
  f5: Mapper<D, E>,
  f6: Mapper<E, F>,
  f7: Mapper<F, J>,
  f8: Mapper<J, S>
): Mapper<T, S>;
export function flow<T, S, A, B, C, D, E, F, J, H>(
  f1: Mapper<T, A>,
  f2: Mapper<A, B>,
  f3: Mapper<B, C>,
  f4: Mapper<C, D>,
  f5: Mapper<D, E>,
  f6: Mapper<E, F>,
  f7: Mapper<F, J>,
  f8: Mapper<J, H>,
  f9: Mapper<H, S>
): Mapper<T, S>;
export function flow<T, S>(...fns: Mapper<any, any>[]) {
  return (value: T) => fns.reduce<unknown>((prev, curr) => curr(prev), value) as S;
}
