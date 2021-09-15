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

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can view stages before starting course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build Your Own Redis');

    assert.ok(coursePage.setupItemIsActive, 'setup item is active by default');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Bind to a port');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Setup');
    await animationsSettled();

    assert.ok(coursePage.setupItemIsActive, 'setup item is active if clicked on');
  });
});
