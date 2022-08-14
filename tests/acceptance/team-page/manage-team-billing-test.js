import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsTeamAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | team-page | manage-team-billing-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('team admin can create team billing session (legacy)', async function (assert) {
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

  test('team with active pilot sees pilot details', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });
    this.server.schema.teamPilots.create({ team: team, endDate: new Date(2099, 0, 1) });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    signIn(this.owner, this.server, user);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    assert.ok(teamPage.pilotDetailsContainer.isPresent, 'pilot details are visible');
    assert.equal(teamPage.pilotDetailsContainer.detailsText, "Your team's pilot is valid until January 1, 2099 12:00 AM.");
  });

  test('team with expired pilot sees pilot details with payment method prompt', async function (assert) {
    testScenario(this.server);

    const user = this.server.schema.users.find('63c51e91-e448-4ea9-821b-a80415f266d3');
    const team = this.server.create('team', { id: 'dummy-team-id', name: 'Dummy Team' });
    this.server.schema.teamPilots.create({ team: team, endDate: new Date(1999, 0, 1) });

    this.server.create('team-membership', {
      createdAt: new Date(),
      id: 'dummy-team-membership-id',
      user: user,
      team: team,
      isAdmin: true,
    });

    signIn(this.owner, this.server, user);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    assert.ok(teamPage.pilotDetailsContainer.isPresent, 'pilot details are visible');
    assert.equal(teamPage.pilotDetailsContainer.detailsText, "Your team's pilot ended on January 1, 1999.");
    assert.equal(teamPage.pilotDetailsContainer.instructionsText, 'Ready to upgrade? Start by adding a payment method:');

    await teamPage.pilotDetailsContainer.clickOnAddPaymentMethodButton();
    assert.equal(window.location.href, 'https://test.com/team_payment_method_update_request', 'should redirect to team billing session URL');
  });
});
