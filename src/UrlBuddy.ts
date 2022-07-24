import { SearchParams, toArray, useValueOrMap } from './utils';
import { flow } from './utils/fp';

import UrlData from './UrlData';

import type { IUrlDto, Mapper, Nullable, ValueOrArray, ValueOrMapper } from './types';

type IInitialValue = string | UrlData | IUrlDto;

export class UrlBuddy {
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

  withProtocol(protocol: string): UrlBuddy;
  withProtocol(fn: Mapper<string>): UrlBuddy;
  withProtocol(value: ValueOrMapper<string>): UrlBuddy {
    const protocol = useValueOrMap(this._data.protocol)(value);

    return this._immutableUpdate((data) => {
      data.protocol = protocol;
    });
  }

  withUsername(username: Nullable<string>): UrlBuddy;
  withUsername(fn: Mapper<Nullable<string>>): UrlBuddy;
  withUsername(value: ValueOrMapper<Nullable<string>>): UrlBuddy {
    const username = useValueOrMap(this._data.username)(value);

    return this._immutableUpdate((data) => {
      data.username = username;
    });
  }

  withPassword(password: Nullable<string>): UrlBuddy;
  withPassword(fn: Mapper<Nullable<string>>): UrlBuddy;
  withPassword(value: ValueOrMapper<Nullable<string>>): UrlBuddy {
    const password = useValueOrMap(this._data.password)(value);
    return this._immutableUpdate((data) => {
      data.password = password;
    });
  }

  withCredentials(username: Nullable<string>, password: Nullable<string>): UrlBuddy;
  withCredentials(usernameMapper: Mapper<Nullable<string>>, passwordMapper: Mapper<Nullable<string>>): UrlBuddy;
  withCredentials(usernameMapper: Mapper<Nullable<string>>, password: Nullable<string>): UrlBuddy;
  withCredentials(username: Nullable<string>, passwordMapper: Mapper<Nullable<string>>): UrlBuddy;
  withCredentials(
    usernameOrFn: ValueOrMapper<Nullable<string>>,
    passwordOrFn: ValueOrMapper<Nullable<string>>
  ): UrlBuddy {
    const username = useValueOrMap(this._data.username)(usernameOrFn);
    const password = useValueOrMap(this._data.password)(passwordOrFn);

    return this.withUsername(username).withPassword(password);
  }

  withDomain(domain: string): UrlBuddy;
  withDomain(fn: Mapper<string>): UrlBuddy;
  withDomain(value: ValueOrMapper<string>): UrlBuddy {
    const domain = useValueOrMap(this._data.domain.toString())(value);

    return this._immutableUpdate((data) => {
      data.domain = domain;
    });
  }

  withPath(path: ValueOrArray<string>): UrlBuddy;
  withPath(fn: Mapper<string[], ValueOrArray<string>>): UrlBuddy;
  withPath(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlBuddy {
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

  withSearchParam(key: string, value: Nullable<string>): UrlBuddy;
  withSearchParam(key: string, fn: Mapper<Nullable<string>>): UrlBuddy;
  withSearchParam(key: string, value: ValueOrMapper<Nullable<string>>) {
    const paramValue = useValueOrMap(this._data.search.get(key) ?? null)(value);

    return this._immutableUpdate((data) => {
      data.search.set(key, paramValue);
    });
  }

  withSearchParams(searchStr: string): UrlBuddy;
  withSearchParams(searchIterable: Iterable<[string, ValueOrMapper<Nullable<string>>]>): UrlBuddy;
  withSearchParams(searchObj: { [key: string]: ValueOrMapper<Nullable<string>> }): UrlBuddy;
  withSearchParams(fn: Mapper<Map<string, Nullable<string>>, string>): UrlBuddy;
  withSearchParams(
    fn: Mapper<Map<string, Nullable<string>>, Iterable<[string, ValueOrMapper<Nullable<string>>]>>
  ): UrlBuddy;
  withSearchParams(
    fn: Mapper<Map<string, Nullable<string>>, { [key: string]: ValueOrMapper<Nullable<string>> }>
  ): UrlBuddy;
  withSearchParams(
    value: ValueOrMapper<
      Map<string, Nullable<string>>,
      Iterable<[string, ValueOrMapper<Nullable<string>>]> | { [key: string]: ValueOrMapper<Nullable<string>> } | string
    >
  ): UrlBuddy {
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

  withHash(hash: Nullable<string>): UrlBuddy;
  withHash(fn: Mapper<Nullable<string>>): UrlBuddy;
  withHash(value: ValueOrMapper<Nullable<string>>) {
    const hash = useValueOrMap(this._data.hash)(value);

    return this._immutableUpdate((data) => {
      data.hash = hash;
    });
  }

  toString(): string {
    return this._data.toString();
  }

  protected _immutableUpdate(updateFn: (data: UrlData) => void): UrlBuddy {
    const newData = this._data.clone();
    updateFn(newData);
    return new UrlBuddy(newData);
  }
}
