import PSLDomainProcessor from './PSLDomainProcessor';
import { toArray, useValueOrMap } from './utils';
import type { Mapper, Nullable, ValueOrArray, ValueOrMapper } from './types';
import { UrlBuddy as UrlBuddyBase } from './UrlBuddy';
import { flow } from './utils/fp';
import UrlData from './UrlData';

export class UrlBuddy extends UrlBuddyBase {
  withTopLevelDomain(tld: string): UrlBuddy;
  withTopLevelDomain(tldArr: string[]): UrlBuddy;
  withTopLevelDomain(mapper: Mapper<string[]>): UrlBuddy;
  withTopLevelDomain(mapper: Mapper<string[], string>): UrlBuddy;
  withTopLevelDomain(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlBuddy {
    const processor = PSLDomainProcessor.fromString(this._data.domain);

    const getValue = useValueOrMap<string[], ValueOrArray<string>>(processor.tld);
    const tld = flow(getValue, toArray)(value);

    processor.tld = tld;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  withSecondLevelDomain(sld: Nullable<string>): UrlBuddy;
  withSecondLevelDomain(fn: Mapper<Nullable<string>>): UrlBuddy;
  withSecondLevelDomain(value: ValueOrMapper<Nullable<string>>): UrlBuddy {
    const processor = PSLDomainProcessor.fromString(this._data.domain);
    const sld = useValueOrMap(processor.sld)(value);

    processor.sld = sld;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  withSubdomain(subdomain: string): UrlBuddy;
  withSubdomain(subdomainArr: string[]): UrlBuddy;
  withSubdomain(mapper: Mapper<string[]>): UrlBuddy;
  withSubdomain(mapper: Mapper<string[], string>): UrlBuddy;
  withSubdomain(value: ValueOrMapper<string[], ValueOrArray<string>>): UrlBuddy {
    const processor = PSLDomainProcessor.fromString(this._data.domain);
    const getValue = useValueOrMap<string[], ValueOrArray<string>>(processor.subdomains);
    const subdomains = flow(getValue, toArray)(value);
    processor.subdomains = subdomains;

    return this._immutableUpdate((data) => {
      data.domain = processor.toString();
    });
  }

  protected override _immutableUpdate(updateFn: (data: UrlData) => void): UrlBuddy {
    const newData = this._data.clone();
    updateFn(newData);
    return new UrlBuddy(newData);
  }
}
