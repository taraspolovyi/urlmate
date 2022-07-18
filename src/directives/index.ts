import type { Mapper, Predicate, ValueOrArray } from '../types';
import { toArray } from '../utils';

export function identity<T>(value: T): T {
  return value;
}

export function constant<T>(value: T): Mapper<any, T> {
  return () => value;
}

export function append<T>(values: ValueOrArray<T>): Mapper<T[]> {
  return (current: T[]) => [...current, ...toArray(values)];
}

export function prepend<T>(values: ValueOrArray<T>): Mapper<T[]> {
  return (current: T[]) => [...toArray(values), ...current];
}

export function doIf<T, S = T>(predicate: Predicate<T>, fnTrue: Mapper<T, S>, fnFalse?: Mapper<T, S>) {
  return (current: T) => (predicate(current) ? fnTrue(current) : fnFalse?.(current) ?? current);
}

type CaseTuple<T, S, U = S> = [value: T, mapper: Mapper<S, U>];

export function doSwitch<T, S, U>(value: T, defaultCase: Mapper<S, U>, ...options: CaseTuple<T, S, U>[]): Mapper<S, U> {
  return options.find((option) => option[0] === value)?.[1] ?? defaultCase;
}

export const constIf = <T>(predicate: Predicate<T>, value: T) => doIf(predicate, constant(value));

export const appendIf = <T>(predicate: Predicate<T[]>, value: ValueOrArray<T>) => doIf(predicate, append(value));

export const prependIf = <T>(predicate: Predicate<T[]>, value: ValueOrArray<T>) => doIf(predicate, prepend(value));
