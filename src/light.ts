import { UrlMate } from './UrlMate';

import type { InitialValue, IUrlDto, Mapper, ValueOrMapper } from './types';
import type UrlData from './UrlData';

export default function urlmate(url: string): UrlMate;
export default function urlmate(url: UrlData): UrlMate;
export default function urlmate(url: IUrlDto): UrlMate;
export default function urlmate(initFn: Mapper<null, string>): UrlMate;
export default function urlmate(initFn: Mapper<null, UrlData>): UrlMate;
export default function urlmate(initFn: Mapper<null, IUrlDto>): UrlMate;
export default function urlmate(initialValue: ValueOrMapper<null, InitialValue>): UrlMate {
  return new UrlMate(initialValue);
}

export { identity, append, appendIf, constant, constIf, prepend, prependIf, doIf, matchOrDefault } from './directives';
