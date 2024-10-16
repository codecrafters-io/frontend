import FakeActionCableConsumer from 'codecrafters-frontend/tests/support/fake-action-cable-consumer';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import testerVersionPage from 'codecrafters-frontend/tests/pages/course-admin/tester-version-page';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | course-admin | tester-versions-page | deprovision-test-runners', function (hooks) {
  setupApplicationTest(hooks);

  test('can deprovision tester version', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const fakeActionCableConsumer = new FakeActionCableConsumer();
    this.owner.register('service:action-cable-consumer', fakeActionCableConsumer, { instantiate: false });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'redis' }),
      commitSha: '1234567890',
      createdAt: new Date(2022, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2022, 1, 1),
      provisionedTestRunnersCount: 0,
      tagName: 'v11',
    });

    const oldTesterVersion = this.server.create('course-tester-version', {
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
    await testerVersionsPage.testerVersionListItem[1].viewTesterVersionButton.click();
    assert.strictEqual(testerVersionPage.descriptionText, 'This tester version has 4 provisioned test runners.');

    await testerVersionPage.deprovisionTestRunnersButton.click();
    assert.ok(testerVersionPage.initiatedDeprovisioningNotice.isVisible, 'should show initiated deprovisioning notice');
    assert.strictEqual(testerVersionPage.descriptionText, 'This tester version has 4 provisioned test runners.');

    await waitUntil(() => fakeActionCableConsumer.hasSubscription('CourseTesterVersionChannel', { course_tester_version_id: oldTesterVersion.id }));

    oldTesterVersion.provisionedTestRunnersCount = 2;
    fakeActionCableConsumer.sendData('CourseTesterVersionChannel', { event: 'updated' });
    await waitUntil(() => testerVersionPage.descriptionText === 'This tester version has 2 provisioned test runners.');

    oldTesterVersion.provisionedTestRunnersCount = 0;
    fakeActionCableConsumer.sendData('CourseTesterVersionChannel', { event: 'updated' });
    await waitUntil(() => testerVersionPage.descriptionText === 'This tester version has no provisioned test runners.');

    await testerVersionPage.clickOnBackToTesterVersionsListButton();
    await testerVersionsPage.testerVersionListItem[0].viewTesterVersionButton.click();
    assert.notOk(testerVersionPage.initiatedDeprovisioningNotice.isVisible, 'should not show initiated deprovisioning notice after navigating away');
  });
});
