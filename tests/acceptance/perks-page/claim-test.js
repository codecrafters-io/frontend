import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | perks-page | claim-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it is redirected to the correct claim url', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    this.server.create('perk', { slug: 'dummy' });

    await visit('/perks/dummy/claim');

    assert.strictEqual(window.location.href, 'https://dummy-claim-url.com/');
  });

  test('it is redirected to /pay if the user has no access to paid content', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.create('perk', { slug: 'dummy' });

    await visit('/perks/dummy/claim');

    assert.strictEqual(currentURL(), '/pay');
  });
});
