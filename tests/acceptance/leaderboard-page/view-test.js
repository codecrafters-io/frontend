import leaderboardPage from 'codecrafters-frontend/tests/pages/leaderboard-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | leaderboard-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
  });

  test('can view as anonymous user', async function (assert) {
    const language = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const leaderboard = language.leaderboard;

    const sampleUserData = [
      { username: 'Gufran', score: 6750, leaderboard },
      { username: 'torvalds', score: 5250, leaderboard },
    ];

    createLeaderboardEntriesFromSampleData(this.server, sampleUserData);

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 2, '2 entries should be shown');
    await percySnapshot('Leaderboard Page - Anonymous User');
  });

  test('can view as authenticated user with leaderboard entry', async function (assert) {
    const currentUser = signInAsStaff(this.owner, this.server);

    const language = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const leaderboard = language.leaderboard;

    const sampleUserData = [
      // Top 10 entries
      { username: 'Gufran', score: 6750 },
      { username: 'torvalds', score: 5250 },
      { username: 'addyosmani', score: 4250 },
      { username: 'addyosmaniveryverylongusername-with-lots-of-characters', score: 3750 },
      { username: 'gaearon', score: 3250 },
      { username: 'yyx990803', score: 2750 },
      { username: 'getify', score: 2250 },
      { username: 'rauchg', score: 2200 },
      { username: 'addyosmani', score: 2125 },
      { username: 'defunkt', score: 2090 },

      // Current user and surrounding entries
      { username: 'lukebechtel', score: 240 },
      { username: 'mzgoddard', score: 225 },
      { username: 'kentcdodds', score: 225 },
      { username: currentUser.username, score: 220 },
      { username: 'dhh', score: 170 },
      { username: 'ericwbailey', score: 170 },
      { username: 'jacobparis', score: 160 },
    ];

    for (const sampleUserDatum of sampleUserData) {
      sampleUserDatum.leaderboard = leaderboard;
    }

    createLeaderboardEntriesFromSampleData(this.server, sampleUserData);

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 17, '17 entries should be shown');
    await percySnapshot('Leaderboard Page');
  });

  test('can view as authenticated user without leaderboard entry', async function (assert) {
    signInAsStaff(this.owner, this.server);

    const language = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const leaderboard = language.leaderboard;

    const sampleUserData = [
      { username: 'Gufran', score: 6750 },
      { username: 'torvalds', score: 5250 },
      { username: 'addyosmani', score: 4250 },
      { username: 'addyosmaniveryverylongusername-with-lots-of-characters', score: 3750 },
      { username: 'gaearon', score: 3250 },
      { username: 'yyx990803', score: 2750 },
      { username: 'getify', score: 2250 },
      { username: 'rauchg', score: 2200 },
      { username: 'addyosmani', score: 2125 },
      { username: 'defunkt', score: 2090 },
    ];

    for (const sampleUserDatum of sampleUserData) {
      sampleUserDatum.leaderboard = leaderboard;
    }

    createLeaderboardEntriesFromSampleData(this.server, sampleUserData);

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 10, '10 entries should be shown');
    await percySnapshot('Leaderboard Page - No User Entry');
  });

  test('can switch languages', async function (assert) {
    signInAsStaff(this.owner, this.server);

    // Create leaderboards for multiple languages
    const rustLanguage = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const pythonLanguage = this.server.schema.languages.all().models.find((language) => language.slug === 'python');

    // Create sample data for both languages
    const sampleUserData = [
      { username: 'rust-user-1', score: 1000, leaderboard: rustLanguage.leaderboard },
      { username: 'rust-user-2', score: 800, leaderboard: rustLanguage.leaderboard },
      { username: 'python-user-1', score: 900, leaderboard: pythonLanguage.leaderboard },
      { username: 'python-user-2', score: 700, leaderboard: pythonLanguage.leaderboard },
    ];

    createLeaderboardEntriesFromSampleData(this.server, sampleUserData);

    // Start on Rust leaderboard
    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');
    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 2, '2 Rust entries should be shown');
    assert.strictEqual(leaderboardPage.entriesTable.entries[0].username, 'rust-user-1', 'first entry should be rust-user-1');
    assert.strictEqual(leaderboardPage.entriesTable.entries[1].username, 'rust-user-2', 'second entry should be rust-user-2');

    // Switch to Python leaderboard
    await leaderboardPage.languageDropdown.toggle();
    await leaderboardPage.languageDropdown.clickOnLink('Python');
    assert.strictEqual(currentURL(), '/leaderboards/python', 'URL should change to Python leaderboard');
    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 2, '2 Python entries should be shown');
    assert.strictEqual(leaderboardPage.entriesTable.entries[0].username, 'python-user-1', 'first entry should be python-user-1');
    assert.strictEqual(leaderboardPage.entriesTable.entries[1].username, 'python-user-2', 'second entry should be python-user-2');
  });

  test('shows progress donuts for entries', async function (assert) {
    const language = this.server.schema.languages.all().models.find((language) => language.slug === 'rust');
    const leaderboard = language.leaderboard;

    const sampleUserData = [
      { username: 'user1', score: 1000, leaderboard },
      { username: 'user2', score: 500, leaderboard },
    ];

    createLeaderboardEntriesFromSampleData(this.server, sampleUserData);

    await leaderboardPage.visit({ language_slug: 'rust' });

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 2, '2 entries should be shown');
    assert.ok(leaderboardPage.entriesTable.entries[0].progressDonut.isVisible, 'First entry should have a progress donut');
    assert.ok(leaderboardPage.entriesTable.entries[1].progressDonut.isVisible, 'Second entry should have a progress donut');
  });

  // Test that surrounding entries are shown if user is not within top 10
  // Test that surrounding entries are not shown if user is within top 10
});

function createLeaderboardEntriesFromSampleData(server, sampleUserData) {
  for (const sampleUserDatum of sampleUserData) {
    let user = server.schema.users.all().models.find((user) => user.username === sampleUserDatum.username);

    user ||= server.create('user', {
      username: sampleUserDatum.username,
      avatarUrl: `https://github.com/${sampleUserDatum.username}.png`,
    });

    server.create('leaderboard-entry', {
      leaderboard: sampleUserDatum.leaderboard,
      user: user,
      score: sampleUserDatum.score,
      scoreUpdatesCount: Math.floor(sampleUserDatum.score / 10),
      relatedCourseSlugs: ['redis', 'shell', 'sqlite', 'grep'].slice(0, Math.floor(sampleUserDatum.score / 50)),
    });
  }
}
