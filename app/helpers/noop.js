import { helper } from '@ember/component/helper';

export function noop() {
  return function () {
    // This is a noop function that does nothing
  };
}

export default helper(noop);
