import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | team-page | manage-team-billing-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('team admin can create team billing session', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    const team = this.server.schema.teams.first();
    this.server.schema.teamSubscriptions.create({ team: team });

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    await teamPage.clickOnManageSubscriptionButton();

    assert.equal(window.location.href, 'https://test.com/team_billing_session', 'should redirect to team billing session URL');
  });
});
