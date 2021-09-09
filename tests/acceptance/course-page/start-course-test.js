import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import signIn from 'codecrafters-frontend/tests/support/sign-in';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | start-course-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can start course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.equal(currentURL(), '/courses/next/redis', 'current URL is course page URL');

    assert.equal(this.server.pretender.handledRequests.length, 3, 'first 3 requests were executed');

    assert.ok(coursePage.setupItem.isOnCreateRepositoryStep, 'current step is create repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Select a language to proceed');

    await coursePage.setupItem.clickOnLanguageButton('Python');

    assert.equal(this.server.pretender.handledRequests.length, 4, 'create repository request was executed');

    assert.ok(coursePage.setupItem.isOnCloneRepositoryStep, 'current step is clone repository step');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is in-progress');
    assert.equal(coursePage.setupItem.footerText, 'Listening for a git push...');

    this.clock.tick(3000);

    assert.equal(this.server.pretender.handledRequests.length, 5, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsInProgress, 'current status is still in-progress');

    this.server.schema.repositories.find(1).update({ lastSubmissionAt: new Date() });

    this.clock.tick(2000);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 6, 'poll request was executed');
    assert.ok(coursePage.setupItem.statusIsComplete, 'current status is complete');
    assert.equal(coursePage.setupItem.footerText, 'Git push received.');

    this.clock.tick(2000);
    await animationsSettled();

    assert.notOk(coursePage.setupItemIsActive, 'setup item is collapsed');
    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is visible');
    await coursesPage.visit(); // Page keeps polling, so tests wouldn't end
  });
});
