import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
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
    let dummy = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: dummy,
      language: go,
      user: currentUser,
    });

    // Stages 2 and 3 are completed
    [2, 3].forEach((stageNumber) => {
      this.server.create('submission', 'withStageCompletion', {
        repository: repository,
        courseStage: dummy.stages.models.sortBy('position')[stageNumber - 1],
      });
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.sidebar.clickOnStepListItem('The second stage');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');

    await coursePage.feedbackPrompt.clickOnOption('😍');
    await coursePage.feedbackPrompt.clickOnSubmitButton();
    assert.strictEqual(coursePage.header.stepName, 'The second stage', 'same stage is shown after feedback submission');

    await coursePage.sidebar.clickOnStepListItem('The second stage');
    assert.ok(coursePage.feedbackPrompt.isVisible, 'has feedback prompt');
    await coursePage.feedbackPrompt.clickOnEditFeedbackButton();
    await coursePage.feedbackPrompt.clickOnOption('😭');
    await coursePage.feedbackPrompt.clickOnSubmitButton();

    assert.strictEqual(coursePage.header.stepName, 'The second stage', 'same stage is shown after editing feedback');
  });
});
