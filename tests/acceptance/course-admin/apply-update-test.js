import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { settled } from '@ember/test-helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import updatePage from 'codecrafters-frontend/tests/pages/course-admin/update-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-admin | apply-update', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can apply update', async function (assert) {
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
      summary: 'test',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    assert.ok(updatePage.applyUpdateButton.isPresent);
    await updatePage.applyUpdateButton.click();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.notOk(updatePage.applyUpdateButton.isPresent);
  });

  test('can apply update with error', async function (assert) {
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
      summary: 'test [should_error]',
    });

    await updatesPage.visit({ course_slug: 'redis' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    assert.ok(updatePage.applyUpdateButton.isPresent);
    await updatePage.applyUpdateButton.click();
    assert.ok(updatePage.applyUpdateButton.isPresent);

    await percySnapshot('Admin - Course Updates - Pending Update With Error');
  });
});
