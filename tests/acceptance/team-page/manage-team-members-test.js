import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | team-page | manage-team-members-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('team admin can view team members & invite link when they are the only member', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.strictEqual(teamPage.members.length, 1, 'expected only one members to be present');

    await percySnapshot('Manage Team - Only Admin Present');
  });

  test('team admin can view team members when multiple members exist', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

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

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(), isAdmin: false });

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.strictEqual(teamPage.members.length, 3, 'expected 3 members to be present');

    await percySnapshot('Manage Team - Multiple Members Present');
  });

  test('team admin can remove team members', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

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

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(2021, 1, 1), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(2021, 2, 1), isAdmin: false });

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.strictEqual(teamPage.members.length, 3, 'expected 3 members to be present');

    await teamPage.members[1].clickRemoveButton();
    await waitUntil(() => teamPage.members.length === 2);

    await teamPage.members[1].clickRemoveButton();
    await waitUntil(() => teamPage.members.length === 1);
  });
});
