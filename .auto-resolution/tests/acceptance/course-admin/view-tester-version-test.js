import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testerVersionPage from 'codecrafters-frontend/tests/pages/course-admin/tester-version-page';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | view-tester-version', function (hooks) {
  setupApplicationTest(hooks);

  test('it has the correct link for viewing releases', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 4,
      tagName: 'v10',
    });

    await testerVersionsPage.visit({ course_slug: 'redis' });
    await testerVersionsPage.testerVersionListItem[0].viewTesterVersionButton.click();
    assert.strictEqual(testerVersionPage.viewReleaseLink.href, 'https://github.com/codecrafters-io/redis-tester/releases/tag/v10');
  });

  test('it properly renders buttons for activating and deprovisioning test runners', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 4,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      provisionedTestRunnersCount: 0,
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'redis' });
    await testerVersionsPage.testerVersionListItem[0].viewTesterVersionButton.click();
    assert.notOk(testerVersionPage.activateTesterVersionButton.isVisible, 'should not have activate button');
    assert.notOk(testerVersionPage.deprovisionTestRunnersButton.isVisible, 'should not have deprovision button');

    await testerVersionsPage.visit({ course_slug: 'redis' });
    await testerVersionsPage.testerVersionListItem[1].viewTesterVersionButton.click();
    assert.ok(testerVersionPage.activateTesterVersionButton.isVisible, 'should have activate button');
    assert.ok(testerVersionPage.deprovisionTestRunnersButton.isVisible, 'should have deprovision button');
  });
});
