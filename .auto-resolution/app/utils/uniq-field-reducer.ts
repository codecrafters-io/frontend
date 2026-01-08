/**
 * Create a reducer that accumulates objects while removing duplicates based on a specified field.
 *
 * The reducer preserves the first occurrence of each distinct field value.
 *
 * @template T - object type
 * @template K - key of T used to determine uniqueness
 * @param {K} fieldName - name of the field used to detect duplicates
 * @returns {(acc: T[], item: T) => T[]} reducer function for Array.prototype.reduce

 * @example
 * ```ts
 * const arr = [{ id: 1 }, { id: 2 }, { id: 1 }];
 * arr.reduce(uniqFieldReducer('id'), []);
 * // -> [{ id: 1 }, { id: 2 }]
 * ```
 */
export default function uniqFieldReducer<T, K extends keyof T>(fieldName: K) {
  const seen = new Set<T[K]>();

  return (acc: T[], item: T): T[] => {
    const value = item[fieldName];

    if (!seen.has(value)) {
      seen.add(value);
      acc.push(item);
    }

    return acc;
  };
}
