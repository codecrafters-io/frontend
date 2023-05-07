import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-daily-limit-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view upgrade prompt if stage is paid', async function (assert) {
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();

    signIn(this.owner, this.server);

    let go = this.server.schema.languages.findBy({ slug: 'go' });
    let docker = this.server.schema.courses.findBy({ slug: 'docker' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: docker,
      language: go,
      name: 'C #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sort((a, b) => a.position - b.position).toArray()[1],
    });

    this.server.create('course-stage-completion', {
      repository: repository,
      courseStage: docker.stages.models.sort((a, b) => a.position - b.position).toArray()[2],
    });

    this.server.create('course-stage-feedback-submission', {
      repository: repository,
      courseStage: docker.stages.models.sort((a, b) => a.position - b.position).toArray()[2],
      status: 'closed',
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');

    assert.ok(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is not free should have upgrade prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.statusText, 'MEMBERSHIP REQUIRED', 'status text should be membership required');

    await percySnapshot('Course Stages - Upgrade Prompt on Active Stage');

    await coursePage.collapsedItems[3].click(); // The previous completed stage
    await animationsSettled();

    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is completed should not have upgrade prompt');

    await coursePage.collapsedItems[4].click(); // The next pending stage
    await animationsSettled();

    assert.notOk(coursePage.activeCourseStageItem.hasUpgradePrompt, 'course stage item that is pending should not have upgrade prompt');
    assert.strictEqual(coursePage.activeCourseStageItem.statusText, 'PENDING', 'status text should be pending');
  });
});
