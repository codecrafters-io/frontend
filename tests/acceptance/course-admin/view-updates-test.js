import config from 'codecrafters-frontend/config/environment';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-updates', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it forces login when user is not logged in', async function (assert) {
    testScenario(this.server);

    try {
      await updatesPage.visit({ course_slug: 'redis' });
    } catch (e) {
      // pass
    }

    assert.strictEqual(
      window.location.href,
      `${config.x.backendUrl}/login?next=http%3A%2F%2Flocalhost%3A7357%2Fcourses%2Fredis%2Fadmin%2Fupdates`,
      'should redirect to team billing session URL',
    );
  });

  test('it renders when no updates are present', async function (assert) {
    assert.expect(0); // temp

    testScenario(this.server);
    signIn(this.owner, this.server);

    await updatesPage.visit({ course_slug: 'redis' });
    await percySnapshot('Admin - Course Updates - No Updates');
  });

  test('it renders when updates are present', async function (assert) {
    assert.expect(0); // temp

    testScenario(this.server);
    signIn(this.owner, this.server);

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

    await updatesPage.visit({ course_slug: 'redis' });
    await percySnapshot('Admin - Course Updates - With Updates');

    await updatesPage.updateListItems[0].clickOnViewUpdateButton();
    await percySnapshot('Admin - Course Updates - Pending Update');

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[1].clickOnViewUpdateButton();
    await percySnapshot('Admin - Course Updates - Applied Update');
  });

  test('it should have a working button for syncing with github', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

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

    await updatesPage.clickOnSyncWithGithubButton();
    assert.strictEqual(updatesPage.updateListItems.length, 2, 'should have 2 updates');
  });
});
