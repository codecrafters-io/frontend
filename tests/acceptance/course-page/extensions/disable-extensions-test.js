import { setupAnimationTest } from 'ember-animated/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | disable-extensions', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can disable extensions when viewing an extension stage', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is /stages/2');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items');

    await coursePage.sidebar.clickOnStepListItem('Start with ext1');
    assert.strictEqual(currentURL(), '/courses/dummy/stages/ext1:1', 'current URL is /stages/ext1:1');

    // TODO: Triggers the recorddata error
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await coursePage.sidebar.clickOnConfigureExtensionsButton();

    // TODO: Triggers the recorddata error
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Disable Extension 1
    await coursePage.configureExtensionsModal.toggleExtension('Extension 1');
    assert.strictEqual(coursePage.sidebar.stepListItems.length, 6, 'step list has 6 items when first extension is disabled');

    assert.strictEqual(currentURL(), '/courses/dummy/stages/2', 'current URL is /stages/2');

    // TODO: Triggers the recorddata error
    await new Promise((resolve) => setTimeout(resolve, 1000));
  });
});
