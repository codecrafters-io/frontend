import { stub } from 'sinon';

/**
 * Stubs the following `window.localStorage` methods with sinon fakes
 * and returns the Map used for storing the fake localStorage cache:
 * - `setItem`
 * - `removeItem`
 * - `clear`
 * - `key`
 * - `get length`
 * @param {Map<string, string>} [cache=new Map<string, string>()] Predefined contents of the fake localStorage cache
 * @returns {Map<string, string>} Fake localStorage cache
 */
export default function stubLocalStorage(cache: Map<string, string> = new Map<string, string>()): Map<string, string> {
  stub(window.localStorage, 'getItem').callsFake(function (key) {
    if (cache.has(key)) {
      return String(cache.get(key));
    } else {
      return null;
    }
  });

  stub(window.localStorage, 'setItem').callsFake(function (key, value) {
    cache.set(key, value);
  });

  stub(window.localStorage, 'removeItem').callsFake(function (key) {
    cache.delete(key);
  });

  stub(window.localStorage, 'clear').callsFake(function () {
    cache.clear();
  });

  stub(window.localStorage, 'key').callsFake(function (index) {
    return [...cache.keys()][index] || null;
  });

  stub(window.localStorage['__proto__'], 'length').get(function () {
    return cache.size;
  });

  return cache;
}
