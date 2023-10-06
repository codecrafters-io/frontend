import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | delete-repository-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('can open delete repository modal', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    assert.ok(coursePage.deleteRepositoryModal.isOpen, 'delete repository modal is open');
  });

  test('can not open delete repository modal if repository is new', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.repositoryDropdown.click();

    assert.notOk(coursePage.repositoryDropdown.content.text.includes('Delete Repository'), 'delete repository action should not be available');
  });

  test('can delete repository', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.hover();
    assert.ok(coursePage.deleteRepositoryModal.deleteRepositoryButton.progressIndicator.isVisible, 'progress indicator should be visible');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.leave();
    assert.notOk(coursePage.deleteRepositoryModal.deleteRepositoryButton.progressIndicator.isVisible, 'progress indicator should not be visible');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.press();
    await new Promise((resolve) => setTimeout(resolve, 6000)); // added an extra second to wait for animation
    assert.strictEqual(currentURL(), '/catalog', 'redirected to catalog page');

    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.repositoryDropdown.click();
    assert.notOk(coursePage.repositoryDropdown.content.text.includes('Delete Repository'), 'delete repository action should not be available');
  });
});
