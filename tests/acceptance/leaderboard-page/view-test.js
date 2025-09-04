import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import leaderboardPage from 'codecrafters-frontend/tests/pages/leaderboard-page';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { module, test } from 'qunit';
import percySnapshot from '@percy/ember';

module('Acceptance | leaderboard-page | view', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);

    for (const language of this.server.schema.languages.all().models) {
      language.update({ leaderboard: this.server.create('leaderboard', { highestPossibleScore: 237 }) });
    }
  });

  test('can view', async function (assert) {
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
      let user = this.server.schema.users.all().models.find((user) => user.username === sampleUserDatum.username);

      user ||= this.server.create('user', {
        username: sampleUserDatum.username,
        avatarUrl: `https://github.com/${sampleUserDatum.username}.png`,
      });

      this.server.create('leaderboard-entry', {
        leaderboard,
        user: user,
        score: sampleUserDatum.score,
        scoreUpdatesCount: Math.floor(sampleUserDatum.score / 10),
        relatedCourseSlugs: ['redis', 'shell', 'sqlite', 'grep'].slice(0, Math.floor(sampleUserDatum.score / 50)),
      });
    }

    await leaderboardPage.visit({ language_slug: 'rust' });
    assert.strictEqual(currentURL(), '/leaderboards/rust');

    assert.strictEqual(leaderboardPage.entriesTable.entries.length, 17, '17 entries should be shown');
    await percySnapshot('Leaderboard Page');
  });

  // Test that one can switch languages
  // Test that surrounding entries are shown if user is not within top 10
  // Test that surrounding entries are not shown if user is within top 10
});
