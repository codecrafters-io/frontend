import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import verifyApiRequests from 'codecrafters-frontend/tests/support/verify-api-requests';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | resume-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can resume course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/redis/stages/rg2', 'current URL is course page URL');

    const expectedRequests = [
      '/api/v1/repositories', // fetch repositories (catalog page)
      '/api/v1/courses', // fetch courses (catalog page)
      '/api/v1/languages', // fetch languages (catalog page)
      '/api/v1/courses', // fetch course details (course overview page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
      '/api/v1/courses', // refresh course (course page)
      '/api/v1/repositories', // fetch repositories (course page)
      '/api/v1/course-stage-comments', // fetch stage comments (course page)
      '/api/v1/course-leaderboard-entries', // fetch leaderboard entries (course page)
    ];

    assert.ok(verifyApiRequests(this.server, expectedRequests), 'API requests match expected sequence');
  });
});
