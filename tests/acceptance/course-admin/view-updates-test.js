import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsStaff, signInAsCourseAuthor } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-updates', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it renders when no updates are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await updatesPage.visit({ course_slug: 'redis' });
    assert.strictEqual(updatesPage.updateListItems.length, 0, 'should have no updates');

    await percySnapshot('Admin - Course Updates - No Updates');
  });

  test('it renders when updates are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(2021, 1, 1),
      newCommitSha: '1234567890',
      newDefinitionFileContents: 'new contents',
      oldCommitSha: '0987654321',
      oldDefinitionFileContents: 'old contents',
      status: 'pending',
      summary: 'Update stage instructions',
    });

    this.server.create('course-definition-update', {
      appliedAt: new Date(2020, 1, 1),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      applier: this.server.schema.users.first(),
      description: 'Updated course description',
      definitionFileContentsDiff: '',
      lastErrorMessage: null,
      lastSyncedAt: new Date(2020, 1, 1),
      newCommitSha: '1234567890',
      newDefinitionFileContents: 'new contents',
      oldCommitSha: '0987654321',
      oldDefinitionFileContents: 'old contents',
      status: 'applied',
      summary: 'Description update',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    assert.strictEqual(updatesPage.updateListItems.length, 2, 'should have 2 updates');
    await percySnapshot('Admin - Course Updates - With Updates');

    await updatesPage.updateListItems[0].clickOnViewUpdateButton();
    await percySnapshot('Admin - Course Updates - Pending Update');

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[1].clickOnViewUpdateButton();
    await percySnapshot('Admin - Course Updates - Applied Update');
  });

  test('it should have a working button for syncing with github', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(),
      newCommitSha: '1234567890',
      newDefinitionFileContents: 'new contents',
      oldCommitSha: '0987654321',
      oldDefinitionFileContents: 'old contents',
      status: 'pending',
      summary: 'Update stage instructions',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    assert.strictEqual(updatesPage.updateListItems.length, 1, 'should have 1 update');

    this.server.create('course-definition-update', {
      appliedAt: new Date(2020, 1, 1),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      applier: this.server.schema.users.first(),
      description: 'Updated course description',
      definitionFileContentsDiff: '',
      lastErrorMessage: null,
      lastSyncedAt: new Date(),
      newCommitSha: '1234567890',
      newDefinitionFileContents: 'new contents',
      oldCommitSha: '0987654321',
      oldDefinitionFileContents: 'old contents',
      status: 'applied',
      summary: 'Description update',
    });

    await updatesPage.clickOnSyncWithGitHubButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.strictEqual(updatesPage.updateListItems.length, 2, 'should have 2 updates');
  });

  test('it has the correct definition repository link', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    course.update('definitionRepositoryFullName', 'codecrafters-io/redis');

    await updatesPage.visit({ course_slug: course.slug });
    assert.strictEqual(updatesPage.definitionRepositoryLink.href, 'https://github.com/codecrafters-io/redis');
    assert.strictEqual(updatesPage.definitionRepositoryLink.text, 'codecrafters-io/redis');
  });

  test('it should not be accessible if user is course author and did not author current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await updatesPage.visit({ course_slug: 'git' });
    assert.strictEqual(currentURL(), '/catalog', 'should redirect to catalog page');
  });

  test('it should be accessible if user is course author and authored current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'redis' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await updatesPage.visit({ course_slug: 'redis' });
    assert.strictEqual(currentURL(), '/courses/redis/admin/updates', 'route should be accessible');
  });
});
