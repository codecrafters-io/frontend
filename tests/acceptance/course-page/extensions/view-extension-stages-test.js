import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | view-extension-stages', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('extension stages are enabled by default', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 15, 'step list has 15 items when one extension is enabled');

    await coursePage.sidebar.clickOnStepListItem('RDB file config');
    assert.strictEqual(currentURL(), '/courses/redis/stages/persistence-rdb:1', 'current URL is stage page URL');
  });

  test('can view extension stages after enabling them', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is course page URL');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 4, 'step list has 4 items');

    await coursePage.sidebar.clickOnConfigureExtensionsButton();

    // Enable Extension 2
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when one extension is enabled');

    // View a stage from extension 2
    await coursePage.sidebar.clickOnStepListItem('Start with ext2');
    assert.strictEqual(currentURL(), '/courses/dummy/stages/ext2:1', 'current URL is stage page URL');
  });

  test('can view extension stages after completing base stages', async function (assert) {
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

    course.extensions.models.forEach((extension) => {
      this.server.create('course-extension-activation', {
        extension: extension,
        repository: repository,
      });
    });

    course.stages.models.forEach((stage) => {
      if (!stage.primaryExtensionSlug) {
        this.server.create('course-stage-completion', {
          courseStage: stage,
          repository: repository,
        });
      }
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.strictEqual(currentURL(), '/courses/dummy/stages/ext1:1', 'current URL is course page URL');

    // assert.strictEqual(coursePage.sidebar.stepListItems.length, 4, 'step list has 4 items');

    // await coursePage.sidebar.clickOnConfigureExtensionsButton();

    // // Enable Extension 2
    // await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    // assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when one extension is enabled');

    // // View a stage from extension 2
    // await coursePage.sidebar.clickOnStepListItem('Start with ext2');
    // assert.strictEqual(currentURL(), '/courses/dummy/stages/ext2:1', 'current URL is stage page URL');
  });
});
