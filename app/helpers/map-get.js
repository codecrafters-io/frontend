import { helper } from '@ember/component/helper';

export default helper(function mapGet([map, value]) {
  return map.get(value);
});
