import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, settled } from '@ember/test-helpers';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | enable-extensions-after-completion', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can enable extensions after completing base stages', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is course page URL');

    await coursePage.sidebar.clickOnConfigureExtensionsButton();

    // Disable Extension 1
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when first extension is disabled');

    // Disable Extension 2
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 4, 'step list has 4 items both extensions are disabled');

    this.server.create('submission', 'withSuccessStatus', {
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Temp
    await Promise.all(window.pollerInstances.map((poller) => poller.forcePoll()));
    await settled();

    // URL should still be stage 2
    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is course page URL');

    await coursePage.completedStepNotice.clickOnNextStepButton();
    assert.strictEqual(currentURL(), '/courses/dummy/base-stages-completed', 'current URL is /base-stages-complete');

    await percySnapshot('Base Stages Completed Page');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 5, 'step list has 6 items before first extension is enabled');

    await coursePage.sidebar.clickOnConfigureExtensionsButton();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 7, 'step list has 6 items when first extension is enabled');

    await coursePage.completedStepNotice.clickOnNextStepButton();
    await percySnapshot('Extension - First Stage Page');

    // Enable Extension 2
    await coursePage.sidebar.clickOnConfigureExtensionsButton();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 9, 'step list has 9 items when both extensions are enabled');

    // Disable Extension 1
    await coursePage.sidebar.clickOnConfigureExtensionsButton();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 7, 'step list has 7 items when first extension is removed');
  });
});
