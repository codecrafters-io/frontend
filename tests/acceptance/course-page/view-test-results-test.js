import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';

module('Acceptance | course-page | view-test-results', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view test results bar when no repository is present', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    // let currentUser = this.server.schema.users.first();
    // let python = this.server.schema.languages.findBy({ name: 'Python' });
    // let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    await coursePage.testResultsBar.clickOnBottomSection();
    // await this.pauseTest();
    // assert.strictEqual(coursePage.testResultsBar.logsPreview.logs, '[stage-1] failure\n[stage-2] failure');

    await percySnapshot('Course Page - View test results - No repository');
  });

  test('can view test results for failed submission', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    this.server.create('submission', 'withFailureStatus', {
      repository: repository,
      courseStage: redis.stages.models.sortBy('position')[1],
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.testResultsBar.click();
    assert.strictEqual(coursePage.testResultsBar.logsPreview.logs, '[stage-1] failure\n[stage-2] failure');

    await percySnapshot('Course Page - View test results - Failure');
  });
});
