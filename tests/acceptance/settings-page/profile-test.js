import profilePage from 'codecrafters-frontend/tests/pages/settings/profile-page';
import userPage from 'codecrafters-frontend/tests/pages/user-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

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
});
