import type { Mapper, Predicate, ValueOrArray, ValueOrMapper } from '../types';

export function useValueOrMap<T, S = T>(current: T) {
  return (value: ValueOrMapper<T, S>): S => {
    return typeof value === 'function' ? (value as (current: T) => S)(current) : value;
  };
}

export function toArray<T>(value: ValueOrArray<T>): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isIterable<T>(value: any): value is Iterable<T> {
  return Symbol.iterator in value;
}

export namespace SearchParams {
  export function toParsed(
    value: Iterable<[string, ValueOrMapper<string | null>]> | { [key: string]: ValueOrMapper<string | null> } | string
  ): Iterable<[string, ValueOrMapper<string | null>]> | { [key: string]: ValueOrMapper<string | null> } {
    return typeof value === 'string' ? new URLSearchParams(value) : value;
  }

  export function toIterable(
    value: Iterable<[string, ValueOrMapper<string | null>]> | { [key: string]: ValueOrMapper<string | null> }
  ): Iterable<[string, ValueOrMapper<string | null>]> {
    return isIterable(value) ? value : Object.entries(value);
  }

  export function toSearchParams(current: Map<string, string | null>) {
    return (iterable: Iterable<[string, ValueOrMapper<string | null>]>) => {
      const params = new Map<string, string | null>();
      for (let [key, value] of iterable) {
        params.set(key, useValueOrMap(current.get(key) ?? null)(value));
      }
      return params;
    };
  }

  export function toString(search: Map<string, string | null>): string {
    return [...search.entries()]
      .filter(([, value]) => value !== null)
      .map((tuple) => tuple.join('='))
      .join('&');
  }
}
