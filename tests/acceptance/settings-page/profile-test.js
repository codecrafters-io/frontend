import profilePage from 'codecrafters-frontend/tests/pages/settings/profile-page';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | settings-page | profile-test', function (hooks) {
  setupApplicationTest(hooks);

  test('can edit profile description', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await profilePage.visit();
    await profilePage.profileDescription.input.fillIn('Updated profile description');
    await profilePage.profileDescription.input.blur();

    await userPage.visit({ username: 'rohitpaulk' });
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
});
