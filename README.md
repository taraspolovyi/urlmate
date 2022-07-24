# UrlBuddy

UrlBuddy is a utility library for manipulating with URLs, specifically when the changes depend on certain conditions, like env variables.

> **NOTE:** This is a weekend project made mostly for fun. It is going to be improved in the future, but the timeline cannot be guaranteed. Although, if you find the library useful, feel free to create issue with bug reports of feature requests. Contributions are also welcomed.

## Installing

To install the library using npm run the following command in your terminal:

```bash
npm install --save urlbuddy
```

Alternatively, if you're using yarn, run:

```bash
yarn add urlbuddy
```

## Using

Here is an example of the library usage with TypeScript.

```typescript
import UrlBuddy, { append, identity, matchOrDefault } from 'urlbuddy';

const baseUrl = urlbuddy('api.example.com')
  .withSubdomain(
    matchOrDefault<string | undefined, string[]>(
      process.env.NODE_ENV,
      identity,
      ['development', append('dev')],
      ['qa', append('qa')],
      ['stage', append('stg')]
    )
  )
  .withPath('v1');

const fooUrl = baseUrl.withPath(append('foo'));
const barUrl = baseUrl.withPath(append('bar'));
const bazUrl = barUrl.withPath(append('baz'));

fetch(fooUrl.toString()); // GET https://api.<env>.example.com/v1/foo
fetch(barUrl.toString()); // GET https://api.<env>.example.com/v1/bar
fetch(bazUrl.toString()); // GET https://api.<env>.example.com/v1/bar/baz
```

Let's go through it step by step:

- Firstly, we initiate `UrlBuddy` with initial URL (note, that when the protocol is not specified it defaults to `https`).
- On the second step, we choose the subdomain that is based on the current environment (`development`, `qa`, `stage`, or anything else)
- After that we specify that we are going to use `v1` version of the given API;
- Since UrlBuddy is immutable, now we can use our base URL representation to create multiple endpoint URLs (`/foo`, `/bar` and `/bar/baz`).
- Finally to use our URLs we just need to convert them back to regular strings by calling `.toString()` method.

### Lightweight version

In order to be able to work with separate parts of the domain (i.e. tld, sld and subdomains), UrlBuddy relies on [psl](https://github.com/lupomontero/psl). It comes with a price of increased bundle size. That is why, if the bundle size is critical or there is no need in sophisticated domain manipulations, there is also `urlbuddy/light`, which doesn't have some domain-related methods, but is only about 3KB uncompressed.

## Methods

### urlbuddy()

```typescript
urlbuddy(url: string): UrlBuddy;
urlbuddy(url: UrlData): UrlBuddy;
urlbuddy(url: IUrlDto): UrlBuddy;
urlbuddy(initFn: Mapper<null, string>): UrlBuddy;
urlbuddy(initFn: Mapper<null, UrlData>): UrlBuddy;
urlbuddy(initFn: Mapper<null, IUrlDto>): UrlBuddy;
```

### toString()

```typescript
toString(): string;
```

Serializes the `urlbuddy` instance to string for further using as a regular URL.

### withDomain()

```typescript
withDomain(domain: string): UrlBuddy;
withDomain(fn: Mapper<string>): UrlBuddy;
```

Allows manipulations with domain as a whole.

```typescript
urlbuddy('example.com/foo/bar')
  .withDomain(
    matchOrDefault<string | undefined, string>(
      process.env.NODE_ENV,
      identity, // => https://example.com/foo/bar/
      ['development', constant('dev.internal-example.com')],  // => https://dev.internal-example.com/foo/bar/
      ['qa', constant('qa.internal-example.com')], // => https://qa.internal-example.com/foo/bar/
      ['beta', constant('beta.example.com')] // => https://beta.example.com/foo/bar/
    )
  )
```

### withTopLevelDomain()

> **NOTE:** not available in `urlbuddy/light`

```typescript
withTopLevelDomain(tld: string): UrlBuddy;
withTopLevelDomain(tldArr: string[]): UrlBuddy;
withTopLevelDomain(mapper: Mapper<string[], string>): UrlBuddy;
withTopLevelDomain(mapper: Mapper<string[]>): UrlBuddy;
```

Allows to perform changes only to top level domain.

```typescript
urlbuddy('example.com')
  .withTopLevelDomain(
    matchOrDefault<string | undefined, string[]>(
      process.env.COUNTRY,
      identity, // => https://example.com/
      ['US', append('us')], // => https://example.com.us/
      ['CA', append('ca')], // => https://example.com.ca/
      ['UA', append('ua')] // => https://example.com.ua/
    )
  )
```

### withSecondLevelDomain()

> **NOTE:** not available in `urlbuddy/light`

```typescript
withSecondLevelDomain(sld: string): UrlBuddy;
withSecondLevelDomain(mapper: Mapper<string>): UrlBuddy;
```

Allows to perform changes only to top level domain.

```typescript
urlbuddy('example.com')
  .withSecondLevelDomain(
    doIf(
      () => process.env.USE_REBRANDED_DOMAIN === 'true',
      constant('something-else') // => https://something-else.com/
    )
  )
```

### withSubdomain()

> **NOTE:** not available in `urlbuddy/light`

```typescript
withSubdomain(subdomain: string): UrlBuddy;
withSubdomain(subdomainsArr: string[]): UrlBuddy;
withSubdomain(fn: Mapper<string[], string>): UrlBuddy;
withSubdomain(fn: Mapper<string[]>): UrlBuddy;
```

Allows to perform changes only to subdomains.

```typescript
urlbuddy('api.example.com')
  .withSubdomain(
    matchOrDefault<string | undefined, string[]>(
      process.env.NODE_ENV,
      identity, // => https://api.example.com/
      ['development', append('dev')], // => https://api.dev.example.com/
      ['qa', append('qa')], // => https://api.qa.example.com/
      ['stage', append('stg')] // => https://api.stg.example.com/
    )
  )
```

### withProtocol()

```typescript
withProtocol(protocol: string): UrlBuddy;
withProtocol(fn: Mapper<string>): UrlBuddy;
```

Allows to perform changes to the protocol. It may be useful when single server handles multiple protocols.

### withUsername()

```typescript
withUsername(domain: Nullable<string>): UrlBuddy;
withUsername(fn: Mapper<Nullable<string>>): UrlBuddy;
```

Changes the username of the URL. Pass `null` if there is a need to remove username.

### withPassword()

```typescript
withPassword(domain: Nullable<string>): UrlBuddy;
withPassword(fn: Mapper<Nullable<string>>): UrlBuddy;
```

Changes the password of the URL. Pass `null` if there is a need to remove username.

### withCredentials()

```typescript
withCredentials(username: Nullable<string>, password: Nullable<string>): UrlBuddy;
withCredentials(username: Nullable<string>, password: Mapper<Nullable<string>>): UrlBuddy;
withCredentials(username: Mapper<Nullable<string>>, password: Nullable<string>): UrlBuddy;
withCredentials(username: Mapper<Nullable<string>>, password: Mapper<Nullable<string>>): UrlBuddy;
```

A quick way to specify both username and password.

### withPath()

```typescript
  withPath(path: ValueOrArray<string>): UrlBuddy;
  withPath(fn: Mapper<string[], ValueOrArray<string>>): UrlBuddy;
```

Allows to apply changes to the path of the URL.

### withSearchParam()

```typescript
withSearchParam(domain: string): UrlBuddy;
withSearchParam(fn: Mapper<string>): UrlBuddy;
```

Set or change value of the URL search parameter base on `key`.

### withSearchParams()

```typescript
withSearchParams(searchStr: string): UrlBuddy;
withSearchParams(searchIterable: Iterable<[string, ValueOrMapper<Nullable<string>>]>): UrlBuddy;
withSearchParams(searchObj: { [key: string]: ValueOrMapper<Nullable<string>> }): UrlBuddy;
withSearchParams(fn: Mapper<Map<string, Nullable<string>>, string>): UrlBuddy;
withSearchParams(fn: Mapper<Map<string, Nullable<string>>, Iterable<[string, ValueOrMapper<Nullable<string>>]>>): UrlBuddy;
withSearchParams(fn: Mapper<Map<string, Nullable<string>>, { [key: string]: ValueOrMapper<Nullable<string>> }>): UrlBuddy;
```

Set or change all URL search parameters.

### withHash()

```typescript
withHash(hash: Nullable<string>): UrlBuddy;
withHash(fn: Mapper<Nullable<string>>): UrlBuddy;
```

Apply changes to hash part of the URL. Pass `null` to remove hash.

## Mappers

UrlBuddy comes with a set of basic helper functions that cover typical cases, but it is not required to use them in your code. Your are free to use your own mapper function, which is covered in the [following section](#using-custom-mappers).

### identity

```typescript
identity<T>(value: T): T
```

A utility mapper that does not transform the current value. It is useful for using in higher order functions to cover cases when no change has to be applied. For example, it can often be used as default mapper of [matchOrDefault](#matchordefault)

### constant

```typescript
constant<T>(value: T): Mapper<any, T>
```

It returns a mapper that returns a provided value regardless of current value. It may be useful when there is a need to set a specific value that is not based on the current one.

### constIf

```typescript
constIf<T>(predicate: Predicate<T>, value: T): Mapper<any, T>
```

Works similarly to [constant](#constant) but also takes a predicate as a first parameter and applies the value only if the predicate returns `true`

```typescript
// => isDev() ? https://dev.foo.com : https://foo.com
urlbuddy('foo.com').withSubdomain(constIf(isDev, 'dev')) 
```

### append

```typescript
append<T>(...values: T[]): Mapper<T[]>
```

Returns a mapper that is used to add a value (or values) to the end of array-based URL components (e.g. subdomain, path, etc.).

```typescript
// => https://api.<environment>.foo.com/
urlbuddy('api.foo.com').withSubdomain(append(environment))
```

### appendIf

```typescript
appendIf<T>(predicate: Predicate<T[]>, ...values: T[]): Mapper<T[]>
```

Applies the [append](#append) mapper only when the predicate returns `true`.

```typescript
// => isDev() ? https://api.dev.foo.com : https://api.foo.com
urlbuddy('api.foo.com').withSubdomain(appendIf(isDev, 'dev'))
```

### prepend

```typescript
prepend<T>(...values: T[]): Mapper<T[]>
```

Returns a mapper that is used to add a value (or values) to the beginning of array-based URL components (e.g. subdomain, path, etc.).

```typescript
// => https://foo.com/<version>/bar/baz
urlbuddy('foo.com/bar/baz').withPath(prepend(version))
```

### prependIf

```typescript
prependIf<T>(predicate: Predicate<T[]>, ...values: T[]): Mapper<T[]>
```

Applies the [prepend](#append) mapper only when the predicate returns `true`.

```typescript
// => isV2() ? https://foo.com/v2/bar/baz : https://api.foo.com/bar/baz
urlbuddy('foo.com/bar/baz').withPath(prependIf(isV2, 'v2'))
```

### doIf

```typescript
doIf<T, S = T, U = T>(
  predicate: Predicate<T>,
  onTrue: Mapper<T, S>,
  onFalse?: Mapper<T, U>
): Mapper<T, T | S | U>
```

A utility higher order function that acts as a regular `if` statement. It takes a predicate as a first argument. Based on its returned value it calls either `onTrue` or `onFalse` mapper. `onFalse` is optional and defaults to [identity](#identity) (i.e. it leaves the value as is).

```typescript
doIf(isFoo, constant('foo.com'), constant('bar.com'))
```

### matchOrDefault

```typescript
matchOrDefault<T, S, U = S>(
  value: T,
  defaultFn: Mapper<S, U>,
  ...optionFns: OptionTuple<T, S, U>[]
): Mapper<S, U>
```

A utility higher order function that acts as `switch` statement. It takes a value as the first argument, default mapper as the second one, after that you may list option tuples, which should be an array of two elements: the first one is a value, the second one is a corresponding mapper. `matchOrDefault` goes through the list of options and calls a mapper if value element of its tuple matches provided value. If no match is found the default mapper is called.

```typescript
matchOrDefault(
  process.env.NODE_ENV,
  constant('example.com'),
  ['development', constant('dev.internal-example.com')],
  ['qa', constant('qa.internal-example.com')],
  ['beta', constant('beta.example.com')]
)
```

### Using custom mappers

`urlbuddy` most methods take any mapper that match `(current: T) => T` signature, so you are free to use your own custom mappers to achieve the necessary result. For example:

```typescript
function omitVowels(current: string) {
  return current.replace(/[aeiouy]/gi, '');
}

// example.com => xmpl.com
urlbuddy('example.com').withSecondLevelDomain(omitVowels)
```