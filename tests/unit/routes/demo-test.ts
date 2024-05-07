import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Route | demo', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    const route = this.owner.lookup('route:demo');
    assert.ok(route);
  });
});
