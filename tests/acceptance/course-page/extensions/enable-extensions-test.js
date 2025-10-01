import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import createCourseExtensionIdeas from 'codecrafters-frontend/mirage/utils/create-course-extension-ideas';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | enable-extensions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can enable extensions', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    createCourseExtensionIdeas(this.server);

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
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/stages/lr7', 'current URL is course page URL');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items');

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.strictEqual(coursePage.configureExtensionsModal.extensionIdeaCards.length, 1, 'course extension idea card should be rendered');

    // Disable Extension 1
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when first extension is disabled');

    // TODO: This has something to do with the RecordCacheData error, investigate
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Disable Extension 2
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 4, 'step list has 4 items both extensions are disabled');

    // Enable Extension 1
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when first extension is enabled');

    // Enable Extension 2
    await coursePage.configureExtensionsModal.toggleExtension('Extension 2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items when both extensions are enabled');
  });

  test('configure extensions button is disabled before a user creates a repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.false(coursePage.configureExtensionsModal.isVisible, 'configure extensions modal is not visible');

    await coursePage.sidebar.configureExtensionsToggles[0].hover();

    assertTooltipContent(assert, {
      contentString: 'Complete repository setup to configure extensions',
    });
  });

  test('configure extensions toggle is disabled before a user creates a repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.false(coursePage.configureExtensionsModal.isVisible, 'configure extensions modal is not visible');

    await coursePage.sidebar.configureExtensionsToggles[0].hover();

    assertTooltipContent(assert, {
      contentString: 'Complete repository setup to configure extensions',
    });
  });

  test('configure extensions button is enabled after a user creates a repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.true(coursePage.configureExtensionsModal.isVisible, 'configure extensions modal is visible');
  });

  test('configure extensions toggle is enabled after a user creates a repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    await coursePage.createRepositoryCard.clickOnLanguageButton('Python');
    await animationsSettled();

    await coursePage.sidebar.configureExtensionsToggles[0].hover();

    assertTooltipContent(assert, {
      contentString: 'Click here to configure extensions',
    });

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.true(coursePage.configureExtensionsModal.isVisible, 'configure extensions modal is visible');
  });

  test('enabled extensions appear first, followed by disabled extensions sorted by position', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withBaseStagesCompleted', {
      course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();
    await coursePage.sidebar.configureExtensionsToggles[0].click();

    assert.strictEqual(coursePage.configureExtensionsModal.extensionCards.length, 2, 'has 2 extension cards');
    assert.strictEqual(coursePage.configureExtensionsModal.extensionCards[0].name, 'Extension 1', 'first card is Extension 1');
    assert.strictEqual(coursePage.configureExtensionsModal.extensionCards[1].name, 'Extension 2', 'second card is Extension 2');

    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');

    assert.strictEqual(coursePage.configureExtensionsModal.extensionCards[0].name, 'Extension 2', 'first card is Extension 2 (enabled)');
    assert.strictEqual(coursePage.configureExtensionsModal.extensionCards[1].name, 'Extension 1', 'second card is Extension 1 (disabled)');
  });

  test('progress pills show correct status for different extension states', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    let repository = this.server.create('repository', 'withBaseStagesCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    let extensions = course.extensions.models.sortBy('position');
    let extension1Stages = course.stages.models.filter((stage) => stage.primaryExtensionSlug === extensions[0].slug);
    let extension2Stages = course.stages.models.filter((stage) => stage.primaryExtensionSlug === extensions[1].slug);

    extension1Stages.forEach((stage) => {
      this.server.create('submission', 'withStageCompletion', {
        repository,
        courseStage: stage,
        createdAt: repository.createdAt,
      });
    });

    this.server.create('submission', 'withStageCompletion', {
      repository,
      courseStage: extension2Stages.sortBy('positionWithinExtension')[0],
      createdAt: repository.createdAt,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();
    await coursePage.sidebar.configureExtensionsToggles[0].click();

    const cards = coursePage.configureExtensionsModal.extensionCards.toArray();

    assert.true(cards[0].hasPill, 'Extension 1 has completed pill');
    assert.true(cards[1].hasPill, 'Extension 2 has in-progress pill');

    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    const disabledExtension1Card = cards.find((card) => card.name === 'Extension 1');
    assert.false(disabledExtension1Card.hasPill, 'Disabled extension has no pill');
  });
});
