import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import profilePage from 'codecrafters-frontend/tests/pages/settings/profile-page';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { module, test } from 'qunit';

module('Acceptance | settings-page | profile-test', function (hooks) {
  setupApplicationTest(hooks);

  test('can edit profile description', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await profilePage.visit();
    await profilePage.profileDescription.input.fillIn('Updated profile description');
    await profilePage.profileDescription.input.blur();

    await profilePage.accountDropdown.toggle();
    await profilePage.accountDropdown.clickOnLink('Your Profile');

    assert.strictEqual(
      userPage.profileDescriptionMarkdown.text,
      'Updated profile description',
      'user page should reflect updated profile description',
    );
  });

  test('can enable anonymous mode', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await profilePage.visit();
    await profilePage.anonymousModeToggle.toggle();
    await profilePage.accountDropdown.toggle();
    await profilePage.accountDropdown.clickOnLink('Your Profile');

    assert.strictEqual(userPage.avatar.src, 'https://avatars.githubusercontent.com/u/59389854'); // Default CC avatar
    assert.strictEqual(userPage.githubDetails.username, 'Anonymous');
    assert.strictEqual(userPage.githubDetails.link, 'https://github.com/ghost');

    await profilePage.visit();

    await profilePage.anonymousModeToggle.toggle();
    await profilePage.accountDropdown.toggle();
    await profilePage.accountDropdown.clickOnLink('Your Profile');

    assert.strictEqual(userPage.avatar.src, 'https://github.com/rohitpaulk.png');
    assert.strictEqual(userPage.githubDetails.username, 'rohitpaulk');
    assert.strictEqual(userPage.githubDetails.link, 'https://github.com/rohitpaulk');
  });

  test('can refresh github username', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();

    assert.strictEqual(currentUser.username, 'rohitpaulk');

    await profilePage.visit();
    await profilePage.refreshFromGitHubButton.click();

    assert.strictEqual(currentUser.reload().username, 'updated-username');
  });

  test('users with anonymous mode toggled should not be able to refresh github username', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await profilePage.visit();
    await profilePage.anonymousModeToggle.toggle();
    await profilePage.accountDropdown.toggle();
    await profilePage.accountDropdown.clickOnLink('Your Profile');

    assert.strictEqual(userPage.githubDetails.username, 'Anonymous');

    await profilePage.visit();
    await profilePage.refreshFromGitHubButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Your profile has anonymous mode enabled. Your GitHub username is not visible to others.',
    });

    await profilePage.refreshFromGitHubButton.click();
    await profilePage.accountDropdown.toggle();
    await profilePage.accountDropdown.clickOnLink('Your Profile');

    assert.strictEqual(userPage.githubDetails.username, 'Anonymous', 'should not have updated username');
  });
});
