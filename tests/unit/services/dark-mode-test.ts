import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';
import type { TestContext } from '@ember/test-helpers';

module('Unit | Service | dark-mode', function (hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function (this: TestContext, assert) {
    const service = this.owner.lookup('service:dark-mode');
    assert.ok(service);
  });
});
