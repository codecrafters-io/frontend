import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createTeamPage from 'codecrafters-frontend/tests/pages/create-team-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | create-team-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can create a new team', async function (assert) {
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

    await createTeamPage.visit();
    await percySnapshot('Create Team - Before Input');

    await createTeamPage.fillInTeamNameInput('New Team');
    await percySnapshot('Create Team - After Input');

    await createTeamPage.clickOnCreateTeamButton();
    assert.strictEqual(currentURL(), `/teams/2`);
  });
});
