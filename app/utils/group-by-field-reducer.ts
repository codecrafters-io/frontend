/**
 * Create a reducer that groups items into an object keyed by the result of `keyFn`.
 *
 * Example:
 *   const byType = groupByFieldReducer((item) => item.type);
 *   items.reduce(byType, {}); // => { typeA: [...], typeB: [...] }
 *
 * @template T - item type
 * @param {(item: T) => string | number | symbol} keyFn - function that returns the group key for each item
 * @returns {(result: { [key: string | number | symbol]: T[] }, element: T) => { [key: string | number | symbol]: T[] }} reducer
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
