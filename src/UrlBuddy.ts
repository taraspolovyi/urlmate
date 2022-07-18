import { SearchParams, toArray, useValueOrMap } from './utils';
import { flow } from './utils/fp';

import UrlData from './UrlData';

import type { IUrlDto, Mapper, Nullable, ValueOrArray, ValueOrMapper } from './types';

type IInitialValue = string | UrlData | IUrlDto;

export class UrlBuddy {
  protected _data: UrlData;

  constructor(value: string);
  constructor(value: UrlData);
  constructor(value: IUrlDto);
  constructor(value: Mapper<null, string>);
  constructor(value: Mapper<null, UrlData>);
  constructor(value: Mapper<null, IUrlDto>);
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

  withProtocol(value: string): UrlBuddy;
  withProtocol(value: Mapper<string>): UrlBuddy;
  withProtocol(value: ValueOrMapper<string>): UrlBuddy;
  withProtocol(value: ValueOrMapper<string>) {
    const protocol = useValueOrMap(this._data.protocol)(value);

    return this._immutableUpdate((data) => {
      data.protocol = protocol;
    });
  }

  withUsername(value: Nullable<string>): UrlBuddy;
  withUsername(value: Mapper<Nullable<string>>): UrlBuddy;
  withUsername(value: ValueOrMapper<Nullable<string>>): UrlBuddy;
  withUsername(value: ValueOrMapper<Nullable<string>>): UrlBuddy {
    const username = useValueOrMap(this._data.username)(value);

    return this._immutableUpdate((data) => {
      data.username = username;
    });
  }

  withPassword(value: Nullable<string>): UrlBuddy;
  withPassword(value: Mapper<Nullable<string>>): UrlBuddy;
  withPassword(value: ValueOrMapper<Nullable<string>>): UrlBuddy;
  withPassword(value: ValueOrMapper<Nullable<string>>): UrlBuddy {
    const password = useValueOrMap(this._data.password)(value);
    return this._immutableUpdate((data) => {
      data.password = password;
    });
  }

  withCredentials(username: Nullable<string>, password: Nullable<string>): UrlBuddy;
  withCredentials(username: Mapper<Nullable<string>>, password: Mapper<Nullable<string>>): UrlBuddy;
  withCredentials(username: Mapper<Nullable<string>>, password: Nullable<string>): UrlBuddy;
  withCredentials(username: Nullable<string>, password: Mapper<Nullable<string>>): UrlBuddy;
  withCredentials(username: ValueOrMapper<Nullable<string>>, password: ValueOrMapper<Nullable<string>>) {
    return this.withUsername(username).withPassword(password);
  }

  withDomain(value: string): UrlBuddy;
  withDomain(value: Mapper<string>): UrlBuddy;
  withDomain(value: ValueOrMapper<string>): UrlBuddy;
  withDomain(value: ValueOrMapper<string>): UrlBuddy {
    const domain = useValueOrMap(this._data.domain.toString())(value);

    return this._immutableUpdate((data) => {
      data.domain = domain;
    });
  }

  withPath(value: ValueOrArray<string>): UrlBuddy;
  withPath(value: Mapper<string[], ValueOrArray<string>>): UrlBuddy;
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
  withSearchParam(key: string, value: Mapper<Nullable<string>>): UrlBuddy;
  withSearchParam(key: string, value: ValueOrMapper<Nullable<string>>): UrlBuddy;
  withSearchParam(key: string, value: ValueOrMapper<Nullable<string>>) {
    const paramValue = useValueOrMap(this._data.search.get(key) ?? null)(value);

    return this._immutableUpdate((data) => {
      data.search.set(key, paramValue);
    });
  }

  withSearchParams(value: string): UrlBuddy;
  withSearchParams(value: Iterable<[string, ValueOrMapper<Nullable<string>>]>): UrlBuddy;
  withSearchParams(value: { [key: string]: ValueOrMapper<Nullable<string>> }): UrlBuddy;
  withSearchParams(
    value: ValueOrMapper<
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

  withHash(value: Nullable<string>): UrlBuddy;
  withHash(value: Mapper<Nullable<string>>): UrlBuddy;
  withHash(value: ValueOrMapper<Nullable<string>>): UrlBuddy;
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
