import { module, test } from 'qunit';

import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Transform | number', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    let transform = this.owner.lookup('transform:number');
    assert.ok(transform);
  });
});
