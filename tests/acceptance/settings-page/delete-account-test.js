import accountPage from 'codecrafters-frontend/tests/pages/settings/account-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, waitUntil, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | settings-page | delete-account-test', function (hooks) {
  setupApplicationTest(hooks);

  test('can open delete account modal', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    assert.true(accountPage.deleteAccountModal.isVisible, 'delete account modal is visible');
  });

  test('delete account modal has the correct copy if the user has not made a submission', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    assert.true(accountPage.deleteAccountModal.text.includes('You have not yet attempted any challenge.'));
    assert.true(accountPage.deleteAccountModal.text.includes('You have not made a submission for any challenge.'));
  });

  test('delete account modal has the correct copy if the user has made a submission to a repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      user: currentUser,
    });

    repository.update({ submissionsCount: 1 });

    await catalogPage.visit();
    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    assert.true(accountPage.deleteAccountModal.text.includes('You have attempted 1 challenge.'));
    assert.true(accountPage.deleteAccountModal.text.includes('You have made 1 submission on 1 repository.'));
  });

  test('delete account modal has the correct copy if the user has made submissions to repositories', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      user: currentUser,
    });

    repository.update({ submissionsCount: 1 });

    let other_repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    other_repository.update({ submissionsCount: 2 });

    await catalogPage.visit();
    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    assert.true(accountPage.deleteAccountModal.text.includes('You have attempted 2 challenges.'));
    assert.true(accountPage.deleteAccountModal.text.includes('You have made 3 submissions on 2 repositories.'));
  });

  test('can delete account', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await accountPage.visit();
    await accountPage.deleteMyAccountButton.click();

    await accountPage.deleteAccountModal.deleteAccountButton.press();
    await waitUntil(() => currentURL() === '/account-deleted');
    await settled();

    assert.notOk(this.server.schema.users.first(), 'user is deleted');
  });
});
