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

    const currentUser = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    assert.strictEqual(currentUser.profileDescriptionMarkdown, undefined)

    await profilePage.visit();
    await profilePage.profileDescription.input.fillIn("Updated profile description");
    await profilePage.profileDescription.input.blur();

    await userPage.visit({ username: 'rohitpaulk' });
    assert.strictEqual(userPage.profileDescriptionMarkdown.text, "Updated profile description");
  });
});
