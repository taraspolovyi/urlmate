import { matchOrDefault } from '../directives';
import urlbuddy from '../index';

enum TestUrls {
  simple = 'https://example.com/',
  withPath = 'https://example.com/foo/bar/',
  withSubdomains = 'https://foo.bar.example.com/',
  withPort = 'https://example.com:8080/',
  withCredentials = 'https://username:password@example.com/',
  withSearchParams = 'https://example.com/?foo=1&bar=baz',
  withHash = 'https://example.com/#foo',
  withTopLevelDomain = 'https://to/',
}

const testUrlLabels = new Map<string, string>()
  .set(TestUrls.simple, 'simple URL')
  .set(TestUrls.withPath, 'URL with path')
  .set(TestUrls.withSubdomains, 'URL with subdomains')
  .set(TestUrls.withPort, 'URL with port')
  .set(TestUrls.withCredentials, 'URL with credentials')
  .set(TestUrls.withSearchParams, 'URL with search params')
  .set(TestUrls.withHash, 'URL with hash')
  .set(TestUrls.withTopLevelDomain, 'URL with Top Level Domain only');

describe('UrlBuddy', () => {
  describe('initiate', () => {
    describe('with string URL', () => {
      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const initialUrl = url;
          const resultUrl = urlbuddy(initialUrl).toString();
          expect(resultUrl).toEqual(initialUrl);
        });
      }

      it('defaults to https when no protocol is specified', () => {
        const initialUrl = 'example.com';
        const resultUrl = urlbuddy(initialUrl).toString();
        expect(resultUrl).toEqual('https://example.com/');
      });
    });

    describe('with URL object', () => {
      for (let [key, url] of Object.entries(TestUrls)) {
        it(`works with ${testUrlLabels.get(key)}`, () => {
          const initialUrl = new URL(url);
          const resultUrl = urlbuddy(initialUrl).toString();
          expect(resultUrl).toEqual(initialUrl.toString());
        });
      }
    });

    describe('with mapper function', () => {
      it('should work', () => {
        const env = 'qa';

        const result = urlbuddy(
          matchOrDefault(
            env,
            () => 'example.com',
            ['development', () => 'dev.example.com'],
            ['qa', () => 'qa.example.com'],
            ['stage', () => 'stg.example.com']
          )
        ).toString();

        expect(result).toEqual('https://qa.example.com/');
      });
    });
  });

  describe('withProtocol()', () => {
    describe('with string argument', () => {
      const protocol = 'mongodb';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'mongodb://example.com')
        .set(TestUrls.withPath, 'mongodb://example.com/foo/bar/')
        .set(TestUrls.withSubdomains, 'mongodb://foo.bar.example.com')
        .set(TestUrls.withPort, 'mongodb://example.com:8080')
        .set(TestUrls.withCredentials, 'mongodb://username:password@example.com')
        .set(TestUrls.withSearchParams, 'mongodb://example.com?foo=1&bar=baz')
        .set(TestUrls.withHash, 'mongodb://example.com#foo')
        .set(TestUrls.withTopLevelDomain, 'mongodb://to');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withProtocol(protocol).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withUsername()', () => {
    describe('with string argument', () => {
      const username = 'testuser';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://testuser@example.com/')
        .set(TestUrls.withPath, 'https://testuser@example.com/foo/bar/')
        .set(TestUrls.withSubdomains, 'https://testuser@foo.bar.example.com/')
        .set(TestUrls.withPort, 'https://testuser@example.com:8080/')
        .set(TestUrls.withCredentials, 'https://testuser:password@example.com/')
        .set(TestUrls.withSearchParams, 'https://testuser@example.com/?foo=1&bar=baz')
        .set(TestUrls.withHash, 'https://testuser@example.com/#foo')
        .set(TestUrls.withTopLevelDomain, 'https://testuser@to/');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withUsername(username).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withPassword()', () => {
    describe('with string argument', () => {
      const password = 'passwd';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://:passwd@example.com/')
        .set(TestUrls.withPath, 'https://:passwd@example.com/foo/bar/')
        .set(TestUrls.withSubdomains, 'https://:passwd@foo.bar.example.com/')
        .set(TestUrls.withPort, 'https://:passwd@example.com:8080/')
        .set(TestUrls.withCredentials, 'https://username:passwd@example.com/')
        .set(TestUrls.withSearchParams, 'https://:passwd@example.com/?foo=1&bar=baz')
        .set(TestUrls.withHash, 'https://:passwd@example.com/#foo')
        .set(TestUrls.withTopLevelDomain, 'https://:passwd@to/');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withPassword(password).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withCredentials', () => {
    describe('with string arguments', () => {
      const username = 'testuser';
      const password = 'passwd';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://testuser:passwd@example.com/')
        .set(TestUrls.withPath, 'https://testuser:passwd@example.com/foo/bar/')
        .set(TestUrls.withSubdomains, 'https://testuser:passwd@foo.bar.example.com/')
        .set(TestUrls.withPort, 'https://testuser:passwd@example.com:8080/')
        .set(TestUrls.withCredentials, 'https://testuser:passwd@example.com/')
        .set(TestUrls.withSearchParams, 'https://testuser:passwd@example.com/?foo=1&bar=baz')
        .set(TestUrls.withHash, 'https://testuser:passwd@example.com/#foo')
        .set(TestUrls.withTopLevelDomain, 'https://testuser:passwd@to/');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withCredentials(username, password).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withDomain()', () => {
    describe('with string argument', () => {
      const domain = 'something-else.au';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://something-else.au/')
        .set(TestUrls.withPath, 'https://something-else.au/foo/bar/')
        .set(TestUrls.withSubdomains, 'https://something-else.au/')
        .set(TestUrls.withPort, 'https://something-else.au:8080/')
        .set(TestUrls.withCredentials, 'https://username:password@something-else.au/')
        .set(TestUrls.withSearchParams, 'https://something-else.au/?foo=1&bar=baz')
        .set(TestUrls.withHash, 'https://something-else.au/#foo')
        .set(TestUrls.withTopLevelDomain, 'https://something-else.au/');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withDomain(domain).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withPath()', () => {
    describe('with string argument', () => {
      const path = '/some/test/path';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/some/test/path')
        .set(TestUrls.withPath, 'https://example.com/some/test/path')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/some/test/path')
        .set(TestUrls.withPort, 'https://example.com:8080/some/test/path')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/some/test/path')
        .set(TestUrls.withSearchParams, 'https://example.com/some/test/path?foo=1&bar=baz')
        .set(TestUrls.withHash, 'https://example.com/some/test/path#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/some/test/path');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withPath(path).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withSearchParam()', () => {
    describe('with string argument', () => {
      const param = { key: 'test', value: 'something' };
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/?test=something')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/?test=something')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/?test=something')
        .set(TestUrls.withPort, 'https://example.com:8080/?test=something')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/?test=something')
        .set(TestUrls.withSearchParams, 'https://example.com/?foo=1&bar=baz&test=something')
        .set(TestUrls.withHash, 'https://example.com/?test=something#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/?test=something');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withSearchParam(param.key, param.value).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }

      it('overwrites an already defined value', () => {
        const resultUrl = urlbuddy(TestUrls.withSearchParams).withSearchParam('foo', 'new').toString();
        expect(resultUrl).toEqual('https://example.com/?foo=new&bar=baz');
      });
    });
  });

  describe('withSearchParams()', () => {
    describe('with string argument', () => {
      const params = 'test=something&another=value';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/?test=something&another=value')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/?test=something&another=value')
        .set(TestUrls.withPort, 'https://example.com:8080/?test=something&another=value')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/?test=something&another=value')
        .set(TestUrls.withSearchParams, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withHash, 'https://example.com/?test=something&another=value#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/?test=something&another=value');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withSearchParams(params).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });

    describe('with URLSearchParams argument', () => {
      const params = new URLSearchParams('test=something&another=value');
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/?test=something&another=value')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/?test=something&another=value')
        .set(TestUrls.withPort, 'https://example.com:8080/?test=something&another=value')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/?test=something&another=value')
        .set(TestUrls.withSearchParams, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withHash, 'https://example.com/?test=something&another=value#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/?test=something&another=value');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withSearchParams(params).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });

    describe('with object argument', () => {
      const params = { test: 'something', another: 'value' };
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/?test=something&another=value')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/?test=something&another=value')
        .set(TestUrls.withPort, 'https://example.com:8080/?test=something&another=value')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/?test=something&another=value')
        .set(TestUrls.withSearchParams, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withHash, 'https://example.com/?test=something&another=value#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/?test=something&another=value');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withSearchParams(params).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });

    describe('with Map argument', () => {
      const params = new Map<string, string>([
        ['test', 'something'],
        ['another', 'value'],
      ]);
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/?test=something&another=value')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/?test=something&another=value')
        .set(TestUrls.withPort, 'https://example.com:8080/?test=something&another=value')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/?test=something&another=value')
        .set(TestUrls.withSearchParams, 'https://example.com/?test=something&another=value')
        .set(TestUrls.withHash, 'https://example.com/?test=something&another=value#foo')
        .set(TestUrls.withTopLevelDomain, 'https://to/?test=something&another=value');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withSearchParams(params).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });

  describe('withHash()', () => {
    describe('with string argument', () => {
      const hash = 'test-hash';
      const expectedUrls = new Map<string, string>()
        .set(TestUrls.simple, 'https://example.com/#test-hash')
        .set(TestUrls.withPath, 'https://example.com/foo/bar/#test-hash')
        .set(TestUrls.withSubdomains, 'https://foo.bar.example.com/#test-hash')
        .set(TestUrls.withPort, 'https://example.com:8080/#test-hash')
        .set(TestUrls.withCredentials, 'https://username:password@example.com/#test-hash')
        .set(TestUrls.withSearchParams, 'https://example.com/?foo=1&bar=baz#test-hash')
        .set(TestUrls.withHash, 'https://example.com/#test-hash')
        .set(TestUrls.withTopLevelDomain, 'https://to/#test-hash');

      for (let url of Object.values(TestUrls)) {
        it(`works with ${testUrlLabels.get(url)}`, () => {
          const resultUrl = urlbuddy(url).withHash(hash).toString();
          expect(resultUrl).toEqual(expectedUrls.get(url));
        });
      }
    });
  });
});
