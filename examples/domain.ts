import UrlBuddy, { identity, append, doSwitch, constant, doIf } from '../src';
/**
 * TODO: describe this
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
 * TODO: describe this
 */
const example_2 = new UrlBuddy('example.com')
  .withDomain(doIf(() => process.env.NODE_ENV === 'development', constant('dev.internal-example.com')))
  .withDomain(doIf(() => process.env.NODE_ENV === 'qa', constant('qa.internal-example.com')))
  .withDomain(doIf(() => process.env.NODE_ENV === 'beta', constant('beta.example.com')))
  .toString();

/**
 * TODO: describe this
 */
const url2 = new UrlBuddy('example.com')
  .withSubdomain(
    doSwitch(
      process.env.NODE_ENV,
      identity,                       // https://example.com/
      ['development', append('dev')], // https://dev.example.com/
      ['qa', append('qa')],           // https://qa.example.com/
      ['stage', append('stg')]        // https://stg.example.com/
    )
  )
  .toString();

/**
 * TODO: describe this
 */
const example_3 = new UrlBuddy('example.com')
  .withTopLevelDomain(
    doSwitch(
      process.env.COUNTRY, 
      identity,                        // https://example.com/
      ['US', append('us')],            // https://example.com.us/
      ['CA', append('ca')],            // https://example.com.ca/
      ['UA', append('ua')]             // https://example.com.ua/
    )
).toString();

/**
 * TODO: describe this
 */
 const example_4 = new UrlBuddy('example.com')
  .withSecondLevelDomain(
    doIf(
      () => process.env.USE_REBRANDED_DOMAIN === 'true', 
      constant('something-else')      // https://something-else.com/
    )
  ).toString();
