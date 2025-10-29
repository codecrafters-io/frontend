/**
 * Create a reducer that accumulates unique items (by strict equality) preserving order.
 *
 * @template T - item type
 * @returns {(acc: T[], item: T) => T[]} reducer function for Array.prototype.reduce
 *
 * @example
 * ```ts
 * [1, 2, 2, 3].reduce(uniqReducer<number>(), []);
 * // -> [1, 2, 3]
 * ```
 */
export default function uniqReducer<T>() {
  const seen = new Set<T>();

  return (acc: T[], item: T): T[] => {
    if (!seen.has(item)) {
      seen.add(item);
      acc.push(item);
    }

    return acc;
  };
}
