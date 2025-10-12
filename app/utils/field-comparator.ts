import { compare } from '@ember/utils';

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
