import type UrlData from './UrlData';

export type ValueOrMapper<T, S = T> = S | Mapper<T, S>;

export type ValueOrArray<T> = T | T[];

export type Mapper<A, B = A> = (value: A) => B;

export type Predicate<T> = (value: T) => boolean;

export type Nullable<T> = T | null;

export type Directive<T, S = T> = (...args: any[]) => Mapper<T, S>;

export type InitialValue = string | UrlData | IUrlDto;

export interface IUrlDto {
  protocol: string;
  username?: string;
  password?: string;
  hostname: string;
  port?: string;
  pathname?: string;
  search?: string;
  hash?: string;
}
