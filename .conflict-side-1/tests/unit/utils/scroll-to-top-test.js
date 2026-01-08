import scrollToTop from 'codecrafters-frontend/utils/scroll-to-top';
import { module, test } from 'qunit';

module('Unit | Utility | scroll-to-top', function () {
  test('it exists', function (assert) {
    assert.strictEqual(typeof scrollToTop, 'function');
  });
});
