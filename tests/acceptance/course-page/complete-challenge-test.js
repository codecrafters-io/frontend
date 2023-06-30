import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
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

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const redis = this.server.schema.courses.findBy({ slug: 'redis' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    redis.stages.models.forEach((courseStage) => {
      this.server.create('submission', 'withSuccessStatus', {
        repository: repository,
        courseStage: courseStage,
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.contains(coursePage.courseCompletedItem.instructionsText, 'Congratulations are in order. Only ~30% of users');
    await coursePage.courseCompletedItem.clickOnPublishToGithubLink();
    assert.ok(coursePage.configureGithubIntegrationModal.isOpen, 'configure github integration modal is open');
  });
});
