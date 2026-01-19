import { helper } from '@ember/component/helper';

export default helper(function setIncludes([set, value]) {
  return set.has(value);
});
