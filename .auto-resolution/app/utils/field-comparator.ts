import { compare } from '@ember/utils';

/**
 * Create a comparator function that compares two objects by one or more fields.
 *
 * The comparator will use the provided field order: the first field is primary,
 * subsequent fields are used as tiebreakers. Uses Ember's `compare` to perform
 * the individual field comparisons and returns a value suitable for
 * Array.prototype.sort.
 *
 * @template T - object type being compared
 * @template K - keys of T that will be used for comparison
 * @param {K} field - primary field to compare
 * @param {...K[]} moreFields - additional fields used as tiebreakers
 * @returns {(a: T, b: T) => number} comparator function for Array.prototype.sort
 *
 * @example
 * ```ts
 * const arr = [{ a:1, b:2 }, { a:1, b:1 }, { a:2, b:0 }];
 * arr.sort(fieldComparator('a', 'b')); // sort by `a`, then by `b`
 * // -> [{ a:1, b:1 }, { a:1, b:2 }, { a:2, b:0 }]
 * ```
 */
export default function fieldComparator<T, K extends keyof T>(field: K, ...moreFields: K[]): (a: T, b: T) => number {
  return (a, b) => {
    for (const key of [field, ...moreFields]) {
      const compareValue = compare(a[key], b[key]);

      if (compareValue) {
        return compareValue;
      }
    }

    return 0;
  };
}
