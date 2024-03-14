import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, waitUntil, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | delete-repository-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupWindowMock(hooks);

  test('can not open delete repository modal if repository is new', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.repositoryDropdown.click();

    assert.notOk(coursePage.repositoryDropdown.content.text.includes('Delete Repository'), 'delete repository action should not be available');
  });

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

  test('modal has the correct submissions count copy', async function (assert) {
    testScenario(this.server, ['dummy']);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    let repository = this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });
    repository.update({ submissionsCount: null });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    assert.ok(coursePage.deleteRepositoryModal.isOpen, 'delete repository modal is open');
    assert.strictEqual(
      coursePage.deleteRepositoryModal.deleteRepositorySubmissionsCountCopy,
      'You have not yet pushed code to this repository.',
      'delete repository submissions count copy is correct when count is null',
    );

    repository.update({ submissionsCount: 0 });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    assert.ok(coursePage.deleteRepositoryModal.isOpen, 'delete repository modal is open');
    assert.strictEqual(
      coursePage.deleteRepositoryModal.deleteRepositorySubmissionsCountCopy,
      'You have not yet pushed code to this repository.',
      'delete repository submissions count copy is correct when count is 0',
    );

    repository.update({ submissionsCount: 1 });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    assert.ok(coursePage.deleteRepositoryModal.isOpen, 'delete repository modal is open');
    assert.strictEqual(
      coursePage.deleteRepositoryModal.deleteRepositorySubmissionsCountCopy,
      'You have pushed code to this repository once.',
      'delete repository submissions count copy is correct when count is 1',
    );

    repository.update({ submissionsCount: 2 });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    assert.ok(coursePage.deleteRepositoryModal.isOpen, 'delete repository modal is open');
    assert.strictEqual(
      coursePage.deleteRepositoryModal.deleteRepositorySubmissionsCountCopy,
      'You have pushed code to this repository 2 times.',
      'delete repository submissions count copy is correct when count is 2',
    );
  });

  test('can delete repository', async function (assert) {
    testScenario(this.server, ['dummy']);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let course = this.server.schema.courses.findBy({ slug: 'dummy' });

    course.update({ releaseStatus: 'live' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: course,
      language: python,
      user: currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Delete Repository');

    await percySnapshot('Course Stages - Delete Repository Modal');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.hover();
    assert.ok(coursePage.deleteRepositoryModal.deleteRepositoryButton.progressIndicator.isVisible, 'progress indicator should be visible');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.leave();
    assert.notOk(coursePage.deleteRepositoryModal.deleteRepositoryButton.progressIndicator.isVisible, 'progress indicator should not be visible');

    await coursePage.deleteRepositoryModal.deleteRepositoryButton.press();
    await waitUntil(() => currentURL() === '/catalog');
    await settled(); // Delete request triggers after redirect

    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();
    await coursePage.repositoryDropdown.click();
    assert.notOk(coursePage.repositoryDropdown.content.text.includes('Delete Repository'), 'delete repository action should not be available');
  });
});
