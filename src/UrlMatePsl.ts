import PSLDomainProcessor from './PSLDomainProcessor';
import { toArray, useValueOrMap } from './utils';
import type { Mapper, Nullable, ValueOrArray, ValueOrMapper } from './types';
import { UrlMate as UrlMateBase } from './UrlMate';
import { flow } from './utils/fp';
import UrlData from './UrlData';

export class UrlMate extends UrlMateBase {
  withTopLevelDomain(tld: string): UrlMate;
  withTopLevelDomain(tldArr: string[]): UrlMate;
  withTopLevelDomain(mapper: Mapper<string[]>): UrlMate;
  withTopLevelDomain(mapper: Mapper<string[], string>): UrlMate;
  withTopLevelDomain(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlMate {
    const processor = PSLDomainProcessor.fromString(this._data.domain);

    const getValue = useValueOrMap<string[], ValueOrArray<string>>(processor.tld);
    const tld = flow(getValue, toArray)(value);

    processor.tld = tld;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  withSecondLevelDomain(sld: Nullable<string>): UrlMate;
  withSecondLevelDomain(fn: Mapper<Nullable<string>>): UrlMate;
  withSecondLevelDomain(value: ValueOrMapper<Nullable<string>>): UrlMate {
    const processor = PSLDomainProcessor.fromString(this._data.domain);
    const sld = useValueOrMap(processor.sld)(value);

    processor.sld = sld;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  withSubdomain(subdomain: string): UrlMate;
  withSubdomain(subdomainArr: string[]): UrlMate;
  withSubdomain(mapper: Mapper<string[]>): UrlMate;
  withSubdomain(mapper: Mapper<string[], string>): UrlMate;
  withSubdomain(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlMate {
    const processor = PSLDomainProcessor.fromString(this._data.domain);
    const getValue = useValueOrMap<string[], ValueOrArray<string>>(processor.subdomains);
    const subdomains = flow(getValue, toArray)(value);
    processor.subdomains = subdomains;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  protected override _immutableUpdate(updateFn: (data: UrlData) => void): UrlMate {
    const newData = this._data.clone();
    updateFn(newData);
    return new UrlMate(newData);
  }
}
