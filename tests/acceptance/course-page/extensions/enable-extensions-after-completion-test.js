import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';
import baseStagesCompletePage from 'codecrafters-frontend/tests/pages/course/base-stages-complete-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';

module('Acceptance | course-page | extensions | enable-extensions-after-completion', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can enable extensions after completing base stages', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update('releaseStatus', 'live');

    const repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/stages/lr7', 'current URL is course page URL');

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    // Disable Extension 1
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when first extension is disabled');

    // Disable Extension 2
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 4, 'step list has 4 items both extensions are disabled');

    this.server.create('submission', 'withStageCompletion', {
      repository: repository,
      courseStage: course.stages.models.find((stage) => stage.position === 2),
    });

    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Temp
    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    // URL should still be stage 2
    assert.strictEqual(currentURL(), '/courses/dummy/stages/lr7', 'current URL is course page URL');

    await coursePage.currentStepCompleteModal.clickOnNextOrActiveStepButton();
    assert.strictEqual(currentURL(), '/courses/dummy/base-stages-completed', 'current URL is /base-stages-complete');

    await percySnapshot('Base Stages Completed Page');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 5, 'step list has 5 items before first extension is enabled');

    // Enable Extension 1
    await baseStagesCompletePage.clickOnConfigureExtensionsButton();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.header.stepName, 'Base stages complete!', 'still on base stages completed page');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 7, 'step list has 7 items when first extension is enabled');

    await coursePage.configureExtensionsModal.clickOnCloseButton();
    assert.strictEqual(coursePage.header.stepName, 'Start with ext1', 'navigated to first extension stage');

    await percySnapshot('Extension - First Stage Page');

    // Enable Extension 2
    await coursePage.sidebar.configureExtensionsToggles[0].click();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 9, 'step list has 9 items when both extensions are enabled');

    // Disable Extension 1
    await coursePage.sidebar.configureExtensionsToggles[0].click();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 7, 'step list has 7 items when first extension is removed');
  });

  test('can enable more extensions after completing an extension (regression)', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update('releaseStatus', 'live');

    const repository = this.server.create('repository', 'withBaseStagesCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/stages/qh7', 'current URL is first extension stage URL');

    // Disable Extension 2
    await coursePage.sidebar.configureExtensionsToggles[0].click();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');

    // Complete all stages for extension 1
    course.stages.models.forEach((stage) => {
      if (stage.primaryExtensionSlug === 'ext1') {
        this.server.create('submission', 'withStageCompletion', {
          repository,
          courseStage: stage,
          createdAt: repository.createdAt, // 1s
        });
      }
    });

    fakeActionCableConsumer.sendData('RepositoryChannel', { event: 'updated' });
    await finishRender();

    // Now go back to catalog page and click on the course again
    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/extension-completed/ext1', 'current URL is extension completed page');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items when extension 1 is completed');

    await coursePage.sidebar.configureExtensionsToggles[0].click();
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(currentURL(), '/courses/dummy/extension-completed/ext1', 'current URL is still extension completed page');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 10, 'step list has 10 items when extension 2 is enabled');
  });

  test('can directly navigate to extension-completed URL', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update('releaseStatus', 'live');

    const repository = this.server.create('repository', 'withBaseStagesCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    // Disable Extension 2 so ext1's ExtensionCompletedStep is visible
    this.server.create('course-extension-activation', {
      repository: repository,
      extension: course.extensions.models.find((ext) => ext.slug === 'ext1'),
    });

    // Complete all stages for extension 1
    course.stages.models.forEach((stage) => {
      if (stage.primaryExtensionSlug === 'ext1') {
        this.server.create('submission', 'withStageCompletion', {
          repository,
          courseStage: stage,
        });
      }
    });

    // Directly visit the extension-completed URL
    await visit('/courses/dummy/extension-completed/ext1');

    assert.strictEqual(currentURL(), '/courses/dummy/extension-completed/ext1', 'stays on extension-completed page');
  });
});
