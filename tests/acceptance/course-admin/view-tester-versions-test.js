import config from 'codecrafters-frontend/config/environment';
import percySnapshot from '@percy/ember';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-tester-versions', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('it forces login when user is not logged in', async function (assert) {
    testScenario(this.server);

    try {
      await testerVersionsPage.visit({ course_slug: 'redis' });
    } catch (e) {
      // pass
    }

    assert.strictEqual(
      window.location.href,
      `${config.x.backendUrl}/login?next=http%3A%2F%2Flocalhost%3A7357%2Fcourses%2Fredis%2Fadmin%2Ftester-versions`,
      'should redirect to login',
    );
  });

  test('it renders when no tester versions are present', async function (assert) {
    assert.expect(0); // temp

    testScenario(this.server);
    signIn(this.owner, this.server);

    await testerVersionsPage.visit({ course_slug: 'redis' });
    await percySnapshot('Admin - Course Tester Versions - No Tester Versions');
  });

  test('it renders when tester versions are present', async function (assert) {
    assert.expect(0); // temp

    testScenario(this.server);
    signIn(this.owner, this.server);

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
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'redis' });
    await percySnapshot('Admin - Course Tester Versions - With Tester Versions');
  });
});
