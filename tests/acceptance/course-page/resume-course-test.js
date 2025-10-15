import apiRequestsCount from 'codecrafters-frontend/tests/support/api-requests-count';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
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
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/stages/lr7', 'current URL is course page URL');

    assert.strictEqual(
      apiRequestsCount(this.server),
      [
        'fetch courses (catalog)',
        'fetch repositories (catalog)',
        'fetch languages (catalog)',
        'fetch courses (course page)',
        'fetch repositories (course page)',
        'fetch repositories (course page)',
        'fetch leaderboard entries (course page)',
        'fetch courses (course overview)',
        'fetch hints (course page)',
        'fetch language guide (course page)',
        'fetch course stage comments (course page)',
      ].length,
    );
  });
});
