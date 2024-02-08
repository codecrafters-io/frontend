import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { settled } from '@ember/test-helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | activate-tester-version', function (hooks) {
  setupApplicationTest(hooks);

  test('can activate tester version', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: false,
      tagName: 'v11',
    });

    let lastConfirmationMessage;

    window.confirm = (message) => {
      lastConfirmationMessage = message;

      return true;
    };

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.ok(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);

    await testerVersionsPage.testerVersionListItem[0].activateButton.click();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.notOk(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);

    await testerVersionsPage.testerVersionListItem[1].activateButton.click();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.ok(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);
    assert.notOk(testerVersionsPage.testerVersionListItem[1].activateButton.isPresent);

    assert.strictEqual(lastConfirmationMessage, 'v11 is the latest version. Are you sure you want to activate v10 instead?');

    const latestTesterVersion = this.server.schema.courseTesterVersions.findBy({ tagName: 'v11' });
    latestTesterVersion.update({ isLatest: false });

    await testerVersionsPage.visit({ course_slug: 'git' });
    await testerVersionsPage.visit({ course_slug: 'redis' });
    await testerVersionsPage.testerVersionListItem[0].activateButton.click();

    assert.strictEqual(lastConfirmationMessage, 'v11 is not the latest version. Are you sure you want to activate it?');
  });
});
