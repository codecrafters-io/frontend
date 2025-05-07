import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | complete-stage-without-changes', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can complete stage without changes', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    // Auto-created submission passes too
    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.toArray().find((stage) => stage.position === 2),
      clientType: 'system',
      commitSha: repository.lastSubmission.commitSha,
      treeSha: repository.lastSubmission.treeSha,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.ok(coursePage.testsPassedModal.isVisible, 'Tests passed modal is visible');
    await coursePage.testsPassedModal.clickOnActionButton('Mark stage as complete');

    assert.notOk(coursePage.testsPassedModal.isVisible, 'Tests passed modal is not visible');
    assert.ok(coursePage.currentStepCompleteModal.isVisible, 'Current step complete modal is visible');
  });
});
