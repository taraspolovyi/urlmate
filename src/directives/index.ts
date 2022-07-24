import type { Mapper, Predicate, ValueOrArray } from '../types';

export function identity<T>(value: T): T {
  return value;
}

export function constant<T>(value: T): Mapper<any, T> {
  return () => value;
}

export function append<T>(...values: T[]): Mapper<T[]> {
  return (current: T[]): T[] => [...current, ...values];
}

export function prepend<T>(...values: T[]): Mapper<T[]> {
  return (current: T[]): T[] => [...values, ...current];
}

export function doIf<T, S = T, U = T>(
  predicate: Predicate<T>,
  onTrue: Mapper<T, S>,
  onFalse?: Mapper<T, U>
): Mapper<T, T | S | U> {
  return (current: T) => (predicate(current) ? onTrue(current) : (onFalse ?? identity)(current));
}

export type OptionTuple<T, S, U = S> = [value: T, mapper: Mapper<S, U>];

export function matchOrDefault<T, S, U = S>(
  value: T,
  defaultFn: Mapper<S, U>,
  ...optionFns: OptionTuple<T, S, U>[]
): Mapper<S, U> {
  return optionFns.find((option) => option[0] === value)?.[1] ?? defaultFn;
}

export const constIf = <T>(predicate: Predicate<T>, value: T) => doIf(predicate, constant(value));

export const appendIf = <T>(predicate: Predicate<T[]>, ...values: T[]) => doIf(predicate, append(...values));

export const prependIf = <T>(predicate: Predicate<T[]>, ...values: T[]) => doIf(predicate, prepend(...values));
