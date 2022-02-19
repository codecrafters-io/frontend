import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-page | start-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can start course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis', 'current URL is course page URL');

    assert.equal(this.server.pretender.handledRequests.length, 5, 'first 3 requests were executed');

    await percySnapshot('Start Course - Select Language');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Select a language to proceed');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.equal(this.server.pretender.handledRequests.length, 6, 'create repository request was executed');

    await percySnapshot('Start Course - Clone Repository');

    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Listening for a git push...');

    assert.equal(
      coursePage.setupItem.copyableCloneRepositoryInstructions,
      'git clone https://git.codecraters.io/a-long-test-string.git codecrafters-redis-python && cd codecrafters-redis-python'
    );

    await this.clock.tick(2001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 7, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is still in-progress');

    let repository = this.server.schema.repositories.find(1);
    repository.update({ lastSubmission: this.server.create('submission', { repository }) });

    await this.clock.tick(2001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 8, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsComplete, 'current status is complete');
    assert.equal(coursePage.setupItem.footerText, 'Git push received.');

    await percySnapshot('Start Course - Git Push Received');

    await this.clock.tick(2001);
    await animationsSettled();

    assert.notOk(coursePage.setupItemIsActive, 'setup item is collapsed');
    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is visible');

    assert.ok(coursePage.activeCourseStageItem.stageInstructionsText.startsWith('CodeCrafters runs tests'), 'Instructions prelude must be present');

    await percySnapshot('Start Course - Waiting For Second Push');
  });

  test('can start repo and abandon halfway (regression)', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    await coursePage.setupItem.clickOnLanguageButton('Python');
    assert.contains(currentURL(), '/courses/redis?repo=', 'current URL includes repo ID');

    await coursePage.header.clickOnChallengesLink();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(currentURL(), '/courses/redis', 'current URL is changed to not include invalid repo');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');

    await animationsSettled();
  });
});
