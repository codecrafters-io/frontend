import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';
import window from 'ember-window-mock';

module('Acceptance | view-team-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('team member sees view team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.ok(catalogPage.accountDropdown.hasLink('View Team'), 'View team link is present');
  });

  test('non-team member does not see view team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.notOk(catalogPage.accountDropdown.hasLink('View Team'), 'Manage team link is not present');
    assert.ok(catalogPage.accountDropdown.hasLink('Invite Your Team'), 'Invite team link is present');
  });

  test('team member can view team members when multiple members exist', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    const team = this.server.schema.teams.first();

    const member1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const member2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    const admin = this.server.create('user', {
      avatarUrl: 'https://github.com/codecrafters-bot.png',
      createdAt: new Date(),
      githubUsername: 'codecrafters-bot',
      username: 'codecrafters-bot',
    });

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: admin, team: team, createdAt: new Date(), isAdmin: true });

    await teamPage.visit({ team_id: team.id });
    assert.strictEqual(teamPage.members.length, 4, 'expected 4 members to be present');
    assert.notOk(teamPage.subscriptionSettingsContainer.hasManageSubscriptionButton, 'manage subscription button must not be enabled for user');

    assert.strictEqual(
      teamPage.inviteURLDescription,
      'To invite new members, ask one of the team admins for an invite URL.',
      'invite url description should say contact admin',
    );

    await percySnapshot('View Team - Multiple Members Present');
  });

  test('team member can leave team', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    const team = this.server.schema.teams.first();

    const member1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const member2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    const admin = this.server.create('user', {
      avatarUrl: 'https://github.com/codecrafters-bot.png',
      createdAt: new Date(),
      githubUsername: 'codecrafters-bot',
      username: 'codecrafters-bot',
    });

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: admin, team: team, createdAt: new Date(), isAdmin: true });

    await teamPage.visit({ team_id: team.id });
    assert.strictEqual(teamPage.members.length, 4, 'expected 4 members to be present');

    window.confirm = () => true;
    await teamPage.memberByUsername('rohitpaulk').clickLeaveTeamButton();

    assert.strictEqual(currentURL(), '/catalog', 'should redirect to catalog page');
  });

  test('team member can switch between teams when multiple exist', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    const team = this.server.schema.teams.first();
    const currentUser = this.server.schema.users.first();
    const team2 = this.server.schema.teams.create({ name: 'Other Team' });

    const member1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const member2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    const admin = this.server.create('user', {
      avatarUrl: 'https://github.com/codecrafters-bot.png',
      createdAt: new Date(),
      githubUsername: 'codecrafters-bot',
      username: 'codecrafters-bot',
    });

    this.server.create('team-membership', { user: currentUser, team: team2, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: admin, team: team, createdAt: new Date(), isAdmin: true });

    await teamPage.visit({ team_id: team.id });
    assert.strictEqual(teamPage.teamSelectionDropdown.activeTeamName, 'Dummy Team', 'expected team name to be Dummy Team');
    assert.strictEqual(teamPage.members.length, 4, 'expected 4 members to be present');

    await teamPage.teamSelectionDropdown.toggle();
    await teamPage.teamSelectionDropdown.clickOnLink('Other Team');
    assert.strictEqual(teamPage.members.length, 1, 'expected 1 member to be present');
    assert.strictEqual(teamPage.teamSelectionDropdown.activeTeamName, 'Other Team', 'expected team name to be Other Team');
  });

  test('team member can view configured slack integration', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    const team = this.server.schema.teams.first();
    this.server.schema.slackIntegrations.create({ team: team, slackChannelName: '#stream-codecrafters' });

    window.confirm = () => true;

    await teamPage.visit({ team_id: team.id });
    await percySnapshot('View Team - Slack Integration Configured');

    assert.ok(teamPage.slackIntegrationSettingsContainer.hasUninstallButton, 'expected slack integration to be configured');
  });
});
