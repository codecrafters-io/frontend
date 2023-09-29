import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Service | head-data', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (assert) {
    let service = this.owner.lookup('service:head-data');
    assert.ok(service);
  });
});
