import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Controller | demo', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const controller = this.owner.lookup('controller:demo');
    assert.ok(controller);
  });
});
