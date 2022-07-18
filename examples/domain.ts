import UrlBuddy, { identity, append, doSwitch, constant, doIf } from '../src';

/**
 * Firstly, we can easily use different hostnames depending on certain condition.
 * For example, let's use different domains based on environment variable NODE_ENV
 */
const example_1 = new UrlBuddy(
  doSwitch(
    process.env.NODE_ENV,
    constant('example.com'),
    ['development', () => 'dev.internal-example.com'],
    ['qa', () => 'qa.internal-example.com'],
    ['beta', () => 'beta.example.com']
  )
).toString();


/**
 * There are cases when we need to initialize UrlBuddy with a URL that has a path
 * In this case it would be beneficial to use withDomain() method, which preserves other URL components
 */
const example_2 = new UrlBuddy('example.com/api')
  .withDomain(
    doIf(
      () => process.env.NODE_ENV === 'development',
      constant('dev.internal-example.com')
    )
  )                                  // https://dev.internal-example.com/api
  .withDomain(
    doIf(
      () => process.env.NODE_ENV === 'qa',
      constant('qa.internal-example.com')
    )                                // https://qa.internal-example.com/api
  )
  .withDomain(
    doIf(
      () => process.env.NODE_ENV === 'beta',
      constant('beta.example.com')
    )                                // https://beta.example.com'/api
  )
  .toString();

/**
 * TODO: describe this
 */
const example_3 = new UrlBuddy('api.example.com')
  .withSubdomain(
    doSwitch(
      process.env.NODE_ENV,
      identity,                       // https://api.example.com/
      ['development', append('dev')], // https://api.dev.example.com/
      ['qa', append('qa')],           // https://api.qa.example.com/
      ['stage', append('stg')]        // https://api.stg.example.com/
    )
  )
  .toString();

/**
 * TODO: describe this
 */
const example_4 = new UrlBuddy('example.com')
  .withTopLevelDomain(
    doSwitch(
      process.env.COUNTRY, 
      identity,                        // https://example.com/
      ['US', append('us')],            // https://example.com.us/
      ['CA', append('ca')],            // https://example.com.ca/
      ['UA', append('ua')]             // https://example.com.ua/
    )
  )
  .toString();

/**
 * TODO: describe this
 */
 const example_5 = new UrlBuddy('example.com')
  .withSecondLevelDomain(
    doIf(
      () => process.env.USE_REBRANDED_DOMAIN === 'true', 
      constant('something-else')      // https://something-else.com/
    )
  )
  .toString();
