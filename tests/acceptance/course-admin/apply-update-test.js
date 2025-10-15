import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { settled } from '@ember/test-helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import updatesPage from 'codecrafters-frontend/tests/pages/course-admin/updates-page';
import updatePage from 'codecrafters-frontend/tests/pages/course-admin/update-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | course-admin | apply-update', function (hooks) {
  setupApplicationTest(hooks);

  test('can apply update', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-definition-update', {
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(),
      newCommitSha: '1234567890',
      oldCommitSha: '0987654321',
      status: 'pending',
      summary: 'test',
    });

    await updatesPage.visit({ course_slug: 'dummy' });
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
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      definitionFileContentsDiff: '',
      description: 'Updated stage instructions for stage 1 & stage 2',
      lastErrorMessage: null,
      lastSyncedAt: new Date(),
      newCommitSha: '1234567890',
      oldCommitSha: '0987654321',
      status: 'pending',
      summary: 'test [should_error]',
    });

    await updatesPage.visit({ course_slug: 'dummy' });
    await updatesPage.updateListItems[0].clickOnViewUpdateButton();

    assert.ok(updatePage.applyUpdateButton.isPresent);
    assert.notOk(updatePage.errorMessage.isVisible);

    await updatePage.applyUpdateButton.click();

    assert.ok(updatePage.applyUpdateButton.isPresent);
    assert.ok(updatePage.errorMessage.isVisible);

    assert.strictEqual(
      updatePage.errorMessage.text,
      'We encountered an error when applying this update: Expected "slug" to be "dummy", got: "docker". Change slug to "dummy" to fix this.',
    );

    await percySnapshot('Admin - Course Updates - Pending Update With Error');
  });
});
