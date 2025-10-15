import percySnapshot from '@percy/ember';
import testerVersionsPage from 'codecrafters-frontend/tests/pages/course-admin/tester-versions-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL, settled } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsCourseAuthor, signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-admin | view-tester-versions', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('it renders when no tester versions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 0, 'should have no tester versions');
    await percySnapshot('Admin - Course Tester Versions - No Tester Versions');
  });

  test('it renders when tester versions are present', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 4,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      provisionedTestRunnersCount: 0,
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 2, 'should have 2 tester versions');
    await percySnapshot('Admin - Course Tester Versions - With Tester Versions');
  });

  test('it should have a working button for syncing with github', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      tagName: 'v10',
    });

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 1, 'should have 1 tester version');

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      tagName: 'v11',
    });

    await testerVersionsPage.clickOnSyncWithGitHubButton();
    await settled(); // Investigate why clickable() doesn't call settled()

    assert.strictEqual(testerVersionsPage.testerVersionListItem.length, 2, 'should have 2 tester versions');
  });

  test('it has the correct tester repository link', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update('testerRepositoryFullName', 'codecrafters-io/dummy-tester');

    await testerVersionsPage.visit({ course_slug: course.slug });
    assert.strictEqual(testerVersionsPage.testerRepositoryLink.href, 'https://github.com/codecrafters-io/dummy-tester');
    assert.strictEqual(testerVersionsPage.testerRepositoryLink.text, 'codecrafters-io/dummy-tester');
  });

  test('it should not be accessible if user is course author and did not author current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await testerVersionsPage.visit({ course_slug: 'git' });
    assert.strictEqual(currentURL(), '/catalog', 'should redirect to catalog page');
  });

  test('it should be accessible if user is course author and authored current course', async function (assert) {
    testScenario(this.server);
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    signInAsCourseAuthor(this.owner, this.server, course);

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    assert.strictEqual(currentURL(), '/courses/dummy/admin/tester-versions', 'route should be accessible');
  });

  test('it properly renders the provisioned test runners count', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 0,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      provisionedTestRunnersCount: 2,
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'dummy' });

    assert.ok(
      testerVersionsPage.testerVersionListItem[0].provisionedTestRunnersCount.isPresent,
      'should be rendered if provisioned test runners count is not 0',
    );

    assert.true(
      testerVersionsPage.testerVersionListItem[0].provisionedTestRunnersCount.text.includes('2'),
      'should render the correct provisioned test runners count',
    );

    assert.notOk(
      testerVersionsPage.testerVersionListItem[1].provisionedTestRunnersCount.isPresent,
      'should not be rendered if provisioned test runners count is 0',
    );
  });

  test('it has the correct provisioned test runners icon tooltip when the tester version is active', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 0,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      provisionedTestRunnersCount: 2,
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    await testerVersionsPage.testerVersionListItem[0].provisionedTestRunnersCount.hover();

    assertTooltipContent(assert, {
      contentString: 'This version has 2 provisioned test runners.',
    });
  });

  test('it has the correct provisioned test runners icon tooltip when the tester version is not active', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: false,
      isActive: false,
      provisionedTestRunnersCount: 1,
      tagName: 'v10',
    });

    this.server.create('course-tester-version', {
      activator: this.server.schema.users.first(),
      course: this.server.schema.courses.findBy({ slug: 'dummy' }),
      commitSha: '1234567890',
      createdAt: new Date(2021, 1, 1),
      isLatest: true,
      isActive: true,
      lastActivatedAt: new Date(2021, 1, 1),
      provisionedTestRunnersCount: 2,
      tagName: 'v11',
    });

    await testerVersionsPage.visit({ course_slug: 'dummy' });
    await testerVersionsPage.testerVersionListItem[1].provisionedTestRunnersCount.hover();

    assertTooltipContent(assert, {
      contentString: 'This version has 1 provisioned test runner. You can deprovision this if you want users to use the active version instead.',
    });
  });
});
