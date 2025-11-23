import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Service | local-storage', function (hooks) {
  setupTest(hooks);

  test('getItem / setItem / removeItem use prefixed keys', function (assert) {
    const service = this.owner.lookup('service:local-storage');

    service.setItem('foo', 'bar');

    assert.strictEqual(window.localStorage.getItem('cc-frontend:foo'), 'bar', 'raw storage has prefixed key');
    assert.strictEqual(service.getItem('foo'), 'bar', 'service returns stored value');

    service.removeItem('foo');
    assert.strictEqual(service.getItem('foo'), null, 'value removed via service');
    assert.strictEqual(window.localStorage.getItem('cc-frontend:foo'), null, 'raw storage entry removed');
  });

  test('length and key return prefixed keys only', function (assert) {
    const service = this.owner.lookup('service:local-storage');

    // add two prefixed keys and one non-prefixed
    service.setItem('one', '1');
    service.setItem('two', '2');
    window.localStorage.setItem('three', '3');

    assert.strictEqual(service.length, 2, 'service.length counts only prefixed keys');

    const keys = [];

    for (let i = 0; i < service.length; i++) {
      keys.push(service.key(i));
    }

    // keys should be unprefixed
    assert.ok(keys.includes('one'), 'contains one');
    assert.ok(keys.includes('two'), 'contains two');
    assert.notOk(keys.includes('three'), 'does not include non-prefixed key');
  });

  test('clear removes only prefixed keys and leaves others intact', function (assert) {
    const service = this.owner.lookup('service:local-storage');

    service.setItem('temp', 'x');
    window.localStorage.setItem('other:keep', 'y');

    // eslint-disable-next-line ember/no-array-prototype-extensions
    service.clear();

    // prefixed keys removed
    assert.strictEqual(service.getItem('temp'), null, 'prefixed key is removed');

    // non-prefixed untouched
    assert.strictEqual(window.localStorage.getItem('other:keep'), 'y', 'non-prefixed key remains');
  });
});
