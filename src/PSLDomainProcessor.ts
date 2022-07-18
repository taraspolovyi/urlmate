import { parse as parseDomain } from 'psl';
import { isNotNull } from './utils';

export default class PSLDomainProcessor {
  static fromString(domain: string): PSLDomainProcessor {
    const parsed = parseDomain(domain);

    if (parsed.error || parsed.sld === null || parsed.tld === null) {
      throw parsed.error ?? Error('Failed to parse domain');
    }

    return new PSLDomainProcessor(parsed.subdomain?.split('.') ?? [], parsed.sld, parsed.tld.split('.'));
  }

  constructor(private _subdomains: string[], private _sld: string | null, private _tld: string[]) {}

  get subdomains(): string[] {
    return this._subdomains;
  }

  set subdomains(value: string[]) {
    this._subdomains = value;
  }

  get sld(): string | null {
    return this._sld;
  }

  set sld(value: string | null) {
    this._sld = value;
  }

  get tld(): string[] {
    return this._tld;
  }

  set tld(value: string[]) {
    if (value.length < 1) {
      throw new Error('There must be at least one top level domain in the URL.');
    }

    this._tld = value;
  }

  toString(): string {
    return [...this._subdomains, this._sld, ...this._tld].join('.');
  }

  toArray(): string[] {
    return [...this._subdomains, this._sld, ...this._tld].filter<string>(isNotNull);
  }

  clone(): PSLDomainProcessor {
    return new PSLDomainProcessor(this._subdomains, this._sld, this._tld);
  }
}
