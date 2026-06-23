import { Response } from 'miragejs';
import { module, test } from 'qunit';
import { setupMirage } from 'codecrafters-frontend/tests/test-support/mirage';
import { setupTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Unit | Service | authenticator', function (hooks) {
  setupTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('syncCurrentUser still loads the user when the email-addresses endpoint fails', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);

    // Regression: an `email-addresses` failure must never break the auth bootstrap (LSD revert of #3869).
    this.server.get('/email-addresses', () => new Response(500, {}, { errors: [{ detail: 'boom' }] }));

    const authenticator = this.owner.lookup('service:authenticator');
    await authenticator.syncCurrentUser();

    assert.ok(authenticator.currentUser, 'current user is loaded despite the failing endpoint');
    assert.strictEqual(authenticator.currentUser.id, user.id, 'the signed-in user is the current user');
  });

  test('syncCurrentUser populates currentUser.emailAddresses for the Lobbyside widget', async function (assert) {
    testScenario(this.server);
    const user = signIn(this.owner, this.server);

    this.server.schema.emailAddresses.create({ user, value: 'work@example.com' });
    this.server.schema.emailAddresses.create({ user, value: 'alt@example.com' });

    const authenticator = this.owner.lookup('service:authenticator');
    await authenticator.syncCurrentUser();
    await this.owner.lookup('service:store').findAll('email-address', { include: 'user' });

    const values = authenticator.currentUser.emailAddresses.map((emailAddress) => emailAddress.value);
    assert.true(values.includes('work@example.com'), 'secondary email is attached to the current user');
    assert.true(values.includes('alt@example.com'), 'all secondary emails are attached to the current user');
  });
});
