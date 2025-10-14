import { drag } from 'ember-sortable/test-support';
import { module, test } from 'qunit';
import { settled, waitFor } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | extensions | reorder-extensions', function (hooks) {
  setupApplicationTest(hooks);

  test('can reorder enabled extensions', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items initially');

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    let cards = coursePage.configureExtensionsModal.extensionCards.toArray();
    assert.strictEqual(cards[0].name, 'Extension 1', 'First card is Extension 1');
    assert.strictEqual(cards[1].name, 'Extension 2', 'Second card is Extension 2');

    const sortableCards = document.querySelectorAll('[data-test-sortable-extension-card]');
    assert.strictEqual(sortableCards.length, 2, 'Should have 2 sortable cards');

    await drag('mouse', '[data-test-sortable-extension-card]:first-child [data-test-sortable-item-drag-handle]', () => {
      return { dy: sortableCards[0].getBoundingClientRect().height + 10, dx: 0 };
    });

    await settled();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    cards = coursePage.configureExtensionsModal.extensionCards.toArray();
    assert.strictEqual(cards[0].name, 'Extension 2', 'First card is now Extension 2');
    assert.strictEqual(cards[1].name, 'Extension 1', 'Second card is now Extension 1');

    const activations = this.server.schema.courseExtensionActivations.all().models;
    const extension1Activation = activations.find((a) => a.extension.name === 'Extension 1');
    const extension2Activation = activations.find((a) => a.extension.name === 'Extension 2');

    assert.strictEqual(extension2Activation.position, 1, 'Extension 2 has position 1');
    assert.strictEqual(extension1Activation.position, 2, 'Extension 1 has position 2');

    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list still has 8 items after reorder');
  });

  test('reorder persists after closing and reopening modal', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    const python = this.server.schema.languages.findBy({ name: 'Python' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.adminPanel.clickOnStartCourse();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list has 8 items initially');

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    const sortableCards = document.querySelectorAll('[data-test-sortable-extension-card]');

    await drag('mouse', '[data-test-sortable-extension-card]:first-child [data-test-sortable-item-drag-handle]', () => {
      return { dy: sortableCards[0].getBoundingClientRect().height + 10, dx: 0 };
    });

    await settled();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await coursePage.configureExtensionsModal.clickOnCloseButton();

    assert.strictEqual(coursePage.sidebar.stepListItems.length, 8, 'step list still has 8 items after reorder');

    await coursePage.sidebar.configureExtensionsToggles[0].click();

    const cards = coursePage.configureExtensionsModal.extensionCards.toArray();
    assert.strictEqual(cards[0].name, 'Extension 2', 'First card is Extension 2');
    assert.strictEqual(cards[1].name, 'Extension 1', 'Second card is Extension 1');
  });
});
