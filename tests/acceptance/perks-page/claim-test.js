import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { visit } from '@ember/test-helpers';

module('Acceptance | perks-page | claim-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it is redirected to the correct url', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('perk', { slug: 'dummy' });

    await visit('/perks/dummy/claim');

    assert.strictEqual(window.location.href, 'https://dummy-claim-url.com');
  });
});
