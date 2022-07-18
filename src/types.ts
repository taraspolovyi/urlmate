export type ValueOrMapper<T, S = T> = S | Mapper<T, S>;

export type ValueOrArray<T> = T | T[];

export type Mapper<T, S = T> = (value: T) => S;

export type Predicate<T> = (value: T) => boolean;

export type Nullable<T> = T | null;

export type Directive<T, S = T> = (...args: any[]) => Mapper<T, S>;

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
