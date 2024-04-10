import accountPage from 'codecrafters-frontend/tests/pages/settings/account-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, waitUntil, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | settings-page | delete-account-test', function (hooks) {
  setupApplicationTest(hooks);

  test('can open delete account modal', async function (assert) {
    const user = this.server.create('user', { username: 'dummy-username' });

    testScenario(this.server);
    signIn(this.owner, this.server, user);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    assert.true(accountPage.deleteAccountModal.isVisible, 'delete account modal is visible');
    assert.true(accountPage.deleteAccountModal.text.includes('dummy-username'));
  });

  test('can delete account', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    await accountPage.deleteAccountModal.deleteAccountButton.press();
    await waitUntil(() => currentURL() === '/account-deleted');
    await settled();

    assert.notOk(this.server.schema.users.first(), 'user is deleted');
  });

  test('renders failure message if delete fails', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.delete('/users/:id', { errors: ['Delete failed'] }, 500);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    await accountPage.deleteAccountModal.deleteAccountButton.press();
    await waitUntil(() => accountPage.deleteAccountModal.text.includes('Failed to delete account'));

    assert.ok(this.server.schema.users.first(), 'user is not deleted');
  });
});
