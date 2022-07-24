import { IUrlDto } from './types';
import { SearchParams } from './utils';

function ensureProtocol(url: string): string {
  const hasProtocol = /^(\w+):\/\//.test(url);
  return hasProtocol ? url : 'https://' + url;
}

export default class UrlData {
  static fromString(url: string) {
    const dto = new URL(ensureProtocol(url));
    return UrlData.fromUrlDto(dto);
  }

  static fromUrlDto(dto: IUrlDto) {
    return new UrlData(
      dto.protocol,
      dto.username,
      dto.password,
      dto.hostname,
      dto.port,
      dto.pathname?.replace(/(^\/|\/$)/, '').split('/') ?? [],
      new Map(new URLSearchParams(dto.search)),
      dto.hash
    );
  }

  constructor(
    public protocol: string = 'https',
    public username: string | null = null,
    public password: string | null = null,
    public domain: string,
    public port: string | null = null,
    public path: string[] = [],
    public search: Map<string, string | null> = new Map(),
    public hash: string | null = null
  ) {}

  toString(): string {
    if (!this.domain) throw new Error('Cannot construct URL when domain is not set.');

    const baseUrlStr = `${this.protocol.replace(/:$/, '')}://${this.domain.toString()}`;

    const url = new URL(baseUrlStr);

    url.username = this.username ?? '';
    url.password = this.password ?? '';
    url.pathname = this.path.join('/');
    url.port = this.port ?? '';
    url.search = SearchParams.toString(this.search);
    url.hash = this.hash ?? '';

    return url.toString();
  }

  clone(): UrlData {
    return new UrlData(
      this.protocol,
      this.username,
      this.password,
      this.domain,
      this.port,
      this.path.slice(),
      new Map(this.search),
      this.hash
    );
  }
}
