import { UrlBuddy } from './UrlBuddyPsl';

import type { InitialValue, IUrlDto, Mapper, ValueOrMapper } from './types';
import type UrlData from './UrlData';

export default function urlbuddy(url: string): UrlBuddy;
export default function urlbuddy(url: UrlData): UrlBuddy;
export default function urlbuddy(url: IUrlDto): UrlBuddy;
export default function urlbuddy(initFn: Mapper<null, string>): UrlBuddy;
export default function urlbuddy(initFn: Mapper<null, UrlData>): UrlBuddy;
export default function urlbuddy(initFn: Mapper<null, IUrlDto>): UrlBuddy;
export default function urlbuddy(initialValue: ValueOrMapper<null, InitialValue>): UrlBuddy {
  return new UrlBuddy(initialValue);
}

export { identity, append, appendIf, constant, constIf, prepend, prependIf, doIf, matchOrDefault } from './directives';
