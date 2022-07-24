import { SearchParams, toArray, useValueOrMap } from './utils';
import { flow } from './utils/fp';

import UrlData from './UrlData';

import type { IUrlDto, Mapper, Nullable, ValueOrArray, ValueOrMapper } from './types';

type IInitialValue = string | UrlData | IUrlDto;

export class UrlMate {
  protected _data: UrlData;

  constructor(value: ValueOrMapper<null, IInitialValue>) {
    const initialValue = useValueOrMap<null, IInitialValue>(null)(value);

    if (typeof initialValue === 'string') {
      this._data = UrlData.fromString(initialValue);
    } else if (initialValue instanceof UrlData) {
      this._data = initialValue.clone();
    } else {
      this._data = UrlData.fromUrlDto(initialValue);
    }
  }

  withProtocol(protocol: string): UrlMate;
  withProtocol(fn: Mapper<string>): UrlMate;
  withProtocol(value: ValueOrMapper<string>): UrlMate {
    const protocol = useValueOrMap(this._data.protocol)(value);

    return this._immutableUpdate((data) => {
      data.protocol = protocol;
    });
  }

  withUsername(username: Nullable<string>): UrlMate;
  withUsername(fn: Mapper<Nullable<string>>): UrlMate;
  withUsername(value: ValueOrMapper<Nullable<string>>): UrlMate {
    const username = useValueOrMap(this._data.username)(value);

    return this._immutableUpdate((data) => {
      data.username = username;
    });
  }

  withPassword(password: Nullable<string>): UrlMate;
  withPassword(fn: Mapper<Nullable<string>>): UrlMate;
  withPassword(value: ValueOrMapper<Nullable<string>>): UrlMate {
    const password = useValueOrMap(this._data.password)(value);
    return this._immutableUpdate((data) => {
      data.password = password;
    });
  }

  withCredentials(username: Nullable<string>, password: Nullable<string>): UrlMate;
  withCredentials(usernameMapper: Mapper<Nullable<string>>, passwordMapper: Mapper<Nullable<string>>): UrlMate;
  withCredentials(usernameMapper: Mapper<Nullable<string>>, password: Nullable<string>): UrlMate;
  withCredentials(username: Nullable<string>, passwordMapper: Mapper<Nullable<string>>): UrlMate;
  withCredentials(
    usernameOrFn: ValueOrMapper<Nullable<string>>,
    passwordOrFn: ValueOrMapper<Nullable<string>>
  ): UrlMate {
    const username = useValueOrMap(this._data.username)(usernameOrFn);
    const password = useValueOrMap(this._data.password)(passwordOrFn);

    return this.withUsername(username).withPassword(password);
  }

  withDomain(domain: string): UrlMate;
  withDomain(fn: Mapper<string>): UrlMate;
  withDomain(value: ValueOrMapper<string>): UrlMate {
    const domain = useValueOrMap(this._data.domain.toString())(value);

    return this._immutableUpdate((data) => {
      data.domain = domain;
    });
  }

  withPath(path: ValueOrArray<string>): UrlMate;
  withPath(fn: Mapper<string[], ValueOrArray<string>>): UrlMate;
  withPath(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlMate {
    const getValue = useValueOrMap<string[], ValueOrArray<string>>(this._data.path);

    const path = flow(
      getValue,
      toArray,
      (path) => path.map((subpath) => subpath.split('/')),
      (path) => path.flat()
    )(value);

    return this._immutableUpdate((data) => {
      data.path = path;
    });
  }

  withSearchParam(key: string, value: Nullable<string>): UrlMate;
  withSearchParam(key: string, fn: Mapper<Nullable<string>>): UrlMate;
  withSearchParam(key: string, value: ValueOrMapper<Nullable<string>>) {
    const paramValue = useValueOrMap(this._data.search.get(key) ?? null)(value);

    return this._immutableUpdate((data) => {
      data.search.set(key, paramValue);
    });
  }

  withSearchParams(searchStr: string): UrlMate;
  withSearchParams(searchIterable: Iterable<[string, ValueOrMapper<Nullable<string>>]>): UrlMate;
  withSearchParams(searchObj: { [key: string]: ValueOrMapper<Nullable<string>> }): UrlMate;
  withSearchParams(fn: Mapper<Map<string, Nullable<string>>, string>): UrlMate;
  withSearchParams(
    fn: Mapper<Map<string, Nullable<string>>, Iterable<[string, ValueOrMapper<Nullable<string>>]>>
  ): UrlMate;
  withSearchParams(
    fn: Mapper<Map<string, Nullable<string>>, { [key: string]: ValueOrMapper<Nullable<string>> }>
  ): UrlMate;
  withSearchParams(
    value: ValueOrMapper<
      Map<string, Nullable<string>>,
      Iterable<[string, ValueOrMapper<Nullable<string>>]> | { [key: string]: ValueOrMapper<Nullable<string>> } | string
    >
  ): UrlMate {
    const search = flow(
      useValueOrMap(this._data.search),
      SearchParams.toParsed,
      SearchParams.toIterable,
      SearchParams.toSearchParams(this._data.search)
    )(value);

    return this._immutableUpdate((data) => {
      data.search = search;
    });
  }

  withHash(hash: Nullable<string>): UrlMate;
  withHash(fn: Mapper<Nullable<string>>): UrlMate;
  withHash(value: ValueOrMapper<Nullable<string>>) {
    const hash = useValueOrMap(this._data.hash)(value);

    return this._immutableUpdate((data) => {
      data.hash = hash;
    });
  }

  toString(): string {
    return this._data.toString();
  }

  protected _immutableUpdate(updateFn: (data: UrlData) => void): UrlMate {
    const newData = this._data.clone();
    updateFn(newData);
    return new UrlMate(newData);
  }
}
