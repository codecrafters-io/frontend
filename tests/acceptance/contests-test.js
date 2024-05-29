import contestsPage from 'codecrafters-frontend/tests/pages/contests-page';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
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

  server.create('contest', {
    slug: 'weekly-1',
    name: 'Weekly Contest #1',
    startsAt: new Date(now - 9 * 24 * 60 * 60 * 1000), // 9 days ago
    endsAt: new Date(now - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'WeeklyContest',
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
    relatedLanguageSlugs: ['go', 'python'],
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
    startsAt: new Date(now + 12 * 24 * 60 * 60 * 1000), // 12 days from now
    endsAt: new Date(now + 19 * 24 * 60 * 60 * 1000), // 19 days from now
    type: 'WeeklyContest',
  });

  server.create('contest', {
    slug: 'weekly-5',
    name: 'Weekly Contest #5',
    startsAt: new Date(now + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    endsAt: new Date(now + 27 * 24 * 60 * 60 * 1000), // 27 days from now
    type: 'WeeklyContest',
  });
}

module('Acceptance | contests-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    this.owner.unregister('service:date');
    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-13T00:00:00.000Z').getTime();

    dateService.setNow(now);
  });

  hooks.afterEach(function () {
    let dateService = this.owner.lookup('service:date');
    dateService.reset();
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

    await contestsPage.visit({ contest_slug: 'weekly-1' });
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

    await contestsPage.visit({ contest_slug: 'weekly-1' });
    await contestsPage.timeRemainingStatusPill.hover();

    assertTooltipContent(assert, {
      contentString: 'This contest ended at 12:00 AM UTC on 11 January 2024',
    });
  });

  test('header navigation buttons work', async function (assert) {
    testScenario(this.server);
    createContests(this.owner, this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    await contestsPage.headerNavigation.clickOnPreviousContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-1', 'Previous button works');

    await contestsPage.headerNavigation.clickOnPreviousContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-1', 'Previous button is disabled when there are no more previous contests');

    await contestsPage.headerNavigation.clickOnNextContestButton();
    await contestsPage.headerNavigation.clickOnNextContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-3', 'Next button works');

    await contestsPage.headerNavigation.clickOnNextContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-3', 'Next button is disabled when the next contest is the second contest from present');
  });

  test('prize details navigation buttons work', async function (assert) {
    testScenario(this.server);
    createContests(this.owner, this.server);

    signIn(this.owner, this.server);

    await contestsPage.visit({ contest_slug: 'weekly-2' });
    await contestsPage.prizeDetailsNavigation.clickOnPreviousContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-1', 'Previous button works');

    await contestsPage.prizeDetailsNavigation.clickOnPreviousContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-1', 'Previous button is disabled when there are no more previous contests');

    await contestsPage.prizeDetailsNavigation.clickOnNextContestButton();
    await contestsPage.prizeDetailsNavigation.clickOnNextContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-3', 'Next button works');

    await contestsPage.prizeDetailsNavigation.clickOnNextContestButton();

    assert.strictEqual(currentURL(), '/contests/weekly-3', 'Next button is disabled when the next contest is the second contest from present');
  });
});
