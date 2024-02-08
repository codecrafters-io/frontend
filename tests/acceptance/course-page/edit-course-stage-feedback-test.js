import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | edit-course-stage-feedback', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can edit course stage feedback', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: go,
      user: currentUser,
    });

    // Stages 2 and 3 are completed
    [2, 3].forEach((stageNumber) => {
      this.server.create('submission', 'withSuccessStatus', {
        repository: repository,
        courseStage: redis.stages.models.sortBy('position')[stageNumber - 1],
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.sidebar.clickOnStepListItem('Respond to multiple PINGs');
    assert.ok(coursePage.yourTaskCard.hasFeedbackPrompt, 'has feedback prompt');

    await coursePage.yourTaskCard.feedbackPrompt.clickOnOption('😍');
    await coursePage.yourTaskCard.feedbackPrompt.clickOnSubmitButton();
    assert.notOk(coursePage.yourTaskCard.hasFeedbackPrompt, 'feedback prompt is closed');

    await coursePage.yourTaskCard.clickOnActionButton('Edit Feedback');
    assert.ok(coursePage.yourTaskCard.hasFeedbackPrompt, 'has feedback prompt');
  });
});
