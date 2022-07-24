import { UrlBuddy } from './UrlBuddy';

import type { InitialValue, IUrlDto, Mapper, ValueOrMapper } from './types';
import type UrlData from './UrlData';

export default function urlmate(url: string): UrlBuddy;
export default function urlmate(url: UrlData): UrlBuddy;
export default function urlmate(url: IUrlDto): UrlBuddy;
export default function urlmate(initFn: Mapper<null, string>): UrlBuddy;
export default function urlmate(initFn: Mapper<null, UrlData>): UrlBuddy;
export default function urlmate(initFn: Mapper<null, IUrlDto>): UrlBuddy;
export default function urlmate(initialValue: ValueOrMapper<null, InitialValue>): UrlBuddy {
  return new UrlBuddy(initialValue);
}

export { identity, append, appendIf, constant, constIf, prepend, prependIf, doIf, matchOrDefault } from './directives';
