import { setupAnimationTest } from 'codecrafters-frontend/tests/support/animation-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { animationsSettled } from 'ember-animated/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | complete-challenge-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can complete course', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    for (const courseStage of redis.stages.models) {
      this.server.create('course-stage-completion', {
        repository: repository,
        courseStage: courseStage,
      });
    }

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position').toArray()[redis.stages.models.length - 1],
      status: 'closed',
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    await animationsSettled();
    assert.ok(coursePage.courseCompletedItemIsActive, 'course completed item should be active');
    assert.contains(coursePage.courseCompletedItem.instructionsText, '~30%');
  });
});
