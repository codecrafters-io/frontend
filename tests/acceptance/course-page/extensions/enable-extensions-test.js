import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
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

    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is course page URL');

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items');

    await coursePage.sidebar.clickOnConfigureExtensionsButton();

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
});
