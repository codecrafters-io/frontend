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
    currentUser.update({ profileDescriptionMarkdown: '' });

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

  test('tracks when the profile description is updated', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    currentUser.update({ profileDescriptionMarkdown: '' });

    await profilePage.visit();
    await profilePage.profileDescription.input.fillIn('Updated profile description');
    await profilePage.profileDescription.input.blur();

    await userPage.visit({ username: 'rohitpaulk' });

    const analyticsEvents = this.server.schema.analyticsEvents.all().models;
    const filteredAnalyticsEvents = analyticsEvents.filter((event) => event.name !== 'feature_flag_called');
    const filteredAnalyticsEventsNames = filteredAnalyticsEvents.map((event) => event.name);

    assert.ok(filteredAnalyticsEventsNames.includes('updated_profile_description'), 'updated_profile_description event should be tracked');
  });
});
