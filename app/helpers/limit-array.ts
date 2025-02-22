import { helper } from '@ember/component/helper';

export default helper(function limitArray<T>([array, limit]: [T[], number]) {
  if (limit < 0) return [];

  return [...array].reverse().slice(0, limit);
});
