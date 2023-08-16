import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-admin | activate-tester-version', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('can activate tester version', async function (assert) {
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
      isActive: false,
      tagName: 'v11',
    });

    window.confirm = () => true;

    await testerVersionsPage.visit({ course_slug: 'redis' });
    assert.ok(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);

    await testerVersionsPage.testerVersionListItem[0].activateButton.click();
    assert.notOk(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);

    await testerVersionsPage.testerVersionListItem[1].activateButton.click();
    assert.ok(testerVersionsPage.testerVersionListItem[0].activateButton.isPresent);
    assert.notOk(testerVersionsPage.testerVersionListItem[1].activateButton.isPresent);
  });
});
