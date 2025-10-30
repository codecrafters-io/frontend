/**
 * Create a reducer that groups items into an object keyed by the result of `keyFn`.
 *
 * @template T - item type
 * @param {(item: T) => string | number | symbol} keyFn - function that returns the group key for each item
 * @returns {(result: { [key: string | number | symbol]: T[] }, element: T) => { [key: string | number | symbol]: T[] }} reducer function for Array.prototype.reduce
 *
 * @example
 * ```ts
 * const arr = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
 * arr.reduce(groupByFieldReducer(x => x.type), {});
 * // -> { a: [{ type: 'a' }, { type: 'a' }], b: [{ type: 'b' }] }
 * ```
 */
export default function groupByFieldReducer<T>(keyFn: (item: T) => string | number | symbol) {
  return (result: { [key: string | number | symbol]: T[] }, element: T) => {
    const groupKey = keyFn(element);

    if (Object.hasOwnProperty.call(result, groupKey)) {
      result[groupKey]!.push(element);
    } else {
      result[groupKey] = [element];
    }

    return result;
  };
}
