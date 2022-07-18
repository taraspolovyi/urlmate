import { Nullable } from './types';
import { UrlBuddy } from './UrlBuddyPsl';
import { isNotNull } from './utils';

describe('UrlBuddyPsl', () => {
  describe('withTopLevelDomain()', () => {
    describe('with constant argument', () => {
      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain('ua').toString();
        expect(resultUrl).toEqual('https://example.ua/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain('ua').toString();
        expect(resultUrl).toEqual('https://example.ua/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain('ua').toString();
        expect(resultUrl).toEqual('https://foo.bar.example.ua/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain('ua').toString();
        expect(resultUrl).toEqual('https://username:password@example.ua/');
      });
    });

    describe('with mapper argument', () => {
      function appendUA(arr: string[]): string[] {
        return [...arr, 'ua'];
      }

      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain(appendUA).toString();
        expect(resultUrl).toEqual('https://example.com.ua/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain(appendUA).toString();
        expect(resultUrl).toEqual('https://example.com.ua/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain(appendUA).toString();
        expect(resultUrl).toEqual('https://foo.bar.example.com.ua/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withTopLevelDomain(appendUA).toString();
        expect(resultUrl).toEqual('https://username:password@example.com.ua/');
      });
    });
  });

  describe('withSecondLevelDomain()', () => {
    describe('with constant argument', () => {
      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain('testing').toString();
        expect(resultUrl).toEqual('https://testing.com/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain('testing').toString();
        expect(resultUrl).toEqual('https://testing.com/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain('testing').toString();
        expect(resultUrl).toEqual('https://foo.bar.testing.com/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain('testing').toString();
        expect(resultUrl).toEqual('https://username:password@testing.com/');
      });
    });

    describe('with mapper argument', () => {
      function removeVowels(str: Nullable<string>): Nullable<string> {
        return isNotNull(str) ? [...str].filter((c) => !['a', 'e', 'i', 'o', 'u', 'y'].includes(c)).join('') : null;
      }

      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain(removeVowels).toString();
        expect(resultUrl).toEqual('https://xmpl.com/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain(removeVowels).toString();
        expect(resultUrl).toEqual('https://xmpl.com/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain(removeVowels).toString();
        expect(resultUrl).toEqual('https://foo.bar.xmpl.com/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSecondLevelDomain(removeVowels).toString();
        expect(resultUrl).toEqual('https://username:password@xmpl.com/');
      });
    });
  });

  describe('withSubdomain()', () => {
    describe('with constant argument', () => {
      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain('qa').toString();
        expect(resultUrl).toEqual('https://qa.example.com/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain('qa').toString();
        expect(resultUrl).toEqual('https://qa.example.com/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain('qa').toString();
        expect(resultUrl).toEqual('https://qa.example.com/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain('qa').toString();
        expect(resultUrl).toEqual('https://username:password@qa.example.com/');
      });
    });

    describe('with mapper argument', () => {
      function appendStage(arr: string[]): string[] {
        return [...arr, 'stg'];
      }

      it('reassembles when no changes applied', () => {
        const initialUrl = 'https://example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain(appendStage).toString();
        expect(resultUrl).toEqual('https://stg.example.com/');
      });

      it('reassembles with path correctly when no changes applied', () => {
        const initialUrl = 'https://example.com/foo/bar/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain(appendStage).toString();
        expect(resultUrl).toEqual('https://stg.example.com/foo/bar/');
      });

      it('reassembles with subdomains correctly when no changes applied', () => {
        const initialUrl = 'https://foo.bar.example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain(appendStage).toString();
        expect(resultUrl).toEqual('https://foo.bar.stg.example.com/');
      });

      it('reassembles with credentials correctly when no changes applied', () => {
        const initialUrl = 'https://username:password@example.com/';
        const resultUrl = new UrlBuddy(initialUrl).withSubdomain(appendStage).toString();
        expect(resultUrl).toEqual('https://username:password@stg.example.com/');
      });
    });
  });
});
