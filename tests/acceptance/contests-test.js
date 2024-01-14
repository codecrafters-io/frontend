import contestsPage from 'codecrafters-frontend/tests/pages/contests-page';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createContests(owner, server) {
  let dateService = owner.lookup('service:date');
  let now = dateService.now();

  const user1 = server.create('user', {
    id: 'user-1',
    avatarUrl: 'https://github.com/Gufran.png',
    createdAt: new Date(),
    githubUsername: 'Gufran',
    username: 'Gufran',
  });

  const contest = server.create('contest', {
    slug: 'weekly-2',
    name: 'Weekly Contest #2',
    startsAt: new Date(now - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    endsAt: new Date(now + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    type: 'WeeklyContest',
  });

  server.schema.leaderboardEntries.create({
    leaderboard: contest.leaderboard,
    user: user1,
    score: 100,
  });

  server.create('contest', {
    slug: 'weekly-3',
    name: 'Weekly Contest #3',
    startsAt: new Date(now + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endsAt: new Date(now + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    type: 'WeeklyContest',
  });

  server.create('contest', {
    slug: 'weekly-4',
    name: 'Weekly Contest #4',
    startsAt: new Date(now - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    endsAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'WeeklyContest',
  });
}

module('Acceptance | contests-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-13T00:00:00.000Z').getTime();

    dateService.setNow(now);
  });


  test('can view active contest', async function (assert) {
    testScenario(this.server);
    createContests(this.owner, this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    assert.strictEqual(currentURL(), '/contests/weekly-2');

    await percySnapshot('Active Contest');
  });

  test('time remaining status pill shows correct copy', async function (assert) {
    testScenario(this.server);
    createContests(this.owner, this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, '4 days left');

    await contestsPage.visit({ contest_slug: 'weekly-3' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, 'Not started');

    await contestsPage.visit({ contest_slug: 'weekly-4' });
    assert.strictEqual(contestsPage.timeRemainingStatusPill.text, 'Ended');
  });

  test('time remaining status pill tooltip shows correct copy', async function (assert) {
    testScenario(this.server);
    createContests(this.owner, this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    await contestsPage.timeRemainingStatusPill.hover();

    assertTooltipContent(assert, {
      contentString: 'This contest will end at 12:00 AM UTC on 17 January 2024',
    });

    await contestsPage.visit({ contest_slug: 'weekly-3' });
    await contestsPage.timeRemainingStatusPill.hover();

    assertTooltipContent(assert, {
      contentString: 'This contest will start at 12:00 AM UTC on 17 January 2024',
    });

    await contestsPage.visit({ contest_slug: 'weekly-4' });
    await contestsPage.timeRemainingStatusPill.hover();

    assertTooltipContent(assert, {
      contentString: 'This contest ended at 12:00 AM UTC on 11 January 2024',
    });
  });
});
