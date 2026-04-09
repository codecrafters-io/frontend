import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | team-page | manage-team-members-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('team admin can view team members & invite link when they are the only member', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Manage Team');

    assert.strictEqual(teamPage.members.length, 1, 'expected only one member to be present');

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

    this.server.create('team-membership', {
      user: member1,
      team: team,
      createdAt: new Date(),
      isAdmin: false,
      numberOfAttempts: 50,
      numberOfStagesCompleted: 10,
      numberOfStageAttempts: 50,
      numberOfAttempts3m: 20,
      numberOfAttempts6m: 35,
      numberOfAttempts1y: 50,
      numberOfStagesCompleted3m: 4,
      numberOfStagesCompleted6m: 7,
      numberOfStagesCompleted1y: 10,
    });

    this.server.create('team-membership', {
      user: member2,
      team: team,
      createdAt: new Date(),
      isAdmin: false,
      numberOfAttempts: 30,
      numberOfStagesCompleted: 5,
      numberOfStageAttempts: 30,
      numberOfAttempts3m: 10,
      numberOfAttempts6m: 20,
      numberOfAttempts1y: 30,
      numberOfStagesCompleted3m: 2,
      numberOfStagesCompleted6m: 3,
      numberOfStagesCompleted1y: 5,
    });

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

    this.server.create('team-membership', {
      user: member1,
      team: team,
      createdAt: new Date(2021, 1, 1),
      isAdmin: false,
      numberOfAttempts: 0,
      numberOfStagesCompleted: 0,
      numberOfStageAttempts: 0,
      numberOfAttempts3m: 0,
      numberOfAttempts6m: 0,
      numberOfAttempts1y: 0,
      numberOfStagesCompleted3m: 0,
      numberOfStagesCompleted6m: 0,
      numberOfStagesCompleted1y: 0,
    });

    this.server.create('team-membership', {
      user: member2,
      team: team,
      createdAt: new Date(2021, 2, 1),
      isAdmin: false,
      numberOfAttempts: 0,
      numberOfStagesCompleted: 0,
      numberOfStageAttempts: 0,
      numberOfAttempts3m: 0,
      numberOfAttempts6m: 0,
      numberOfAttempts1y: 0,
      numberOfStagesCompleted3m: 0,
      numberOfStagesCompleted6m: 0,
      numberOfStagesCompleted1y: 0,
    });

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
