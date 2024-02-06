import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import FakeDateService from 'codecrafters-frontend/tests/support/fake-date-service';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-course-overview', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders when user is not logged in', async function (assert) {
    testScenario(this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user is logged in', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when user accesses URL directly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await courseOverviewPage.visit({ course_slug: 'redis' });
    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders when anonymous user views alpha course', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'grep' });
    assert.strictEqual(currentURL(), '/courses/grep/overview');
  });

  test('it renders for course with extensions', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'redis' });
    await percySnapshot('Course Overview - With Extensions');

    assert.strictEqual(currentURL(), '/courses/redis/overview');
  });

  test('it renders for course without extensions', async function (assert) {
    testScenario(this.server);

    await courseOverviewPage.visit({ course_slug: 'docker' });
    await percySnapshot('Course Overview - No Extensions');

    assert.strictEqual(currentURL(), '/courses/docker/overview');
  });

  test('it has the notice for when a course is in beta status', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.server.schema.courses.findBy({ slug: 'redis' }).update({ releaseStatus: 'beta' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(
      courseOverviewPage.betaNoticeText,
      "This challenge is free to try when it's in beta. We keep challenges in beta for a few weeks to gather feedback.",
    );
  });

  test('it has the notice for when a course is free', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    this.owner.register('service:date', FakeDateService);

    let dateService = this.owner.lookup('service:date');
    let now = new Date('2024-01-01').getTime();
    dateService.setNow(now);

    let isFreeExpirationDate = new Date(dateService.now() + 20 * 24 * 60 * 60 * 1000);
    this.server.schema.courses.findBy({ slug: 'redis' }).update('isFreeUntil', isFreeExpirationDate);

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    assert.strictEqual(courseOverviewPage.freeNoticeText, 'This challenge is free until 21 January 2024!');
  });

  test('stages for extensions are ordered properly', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await courseOverviewPage.visit({ course_slug: 'grep' });

    const grep = this.server.schema.courses.findBy({ slug: 'grep' });
    const grepLastBaseStageIndex = grep.stages.models.rejectBy('primaryExtensionSlug').length - 1;

    assert.ok(courseOverviewPage.stageListItems[grepLastBaseStageIndex + 1].text.includes('Single Backreference'));
    assert.ok(courseOverviewPage.stageListItems[grepLastBaseStageIndex + 2].text.includes('Multiple Backreferences'));
    assert.ok(courseOverviewPage.stageListItems[grepLastBaseStageIndex + 3].text.includes('Nested Backreferences'));
  });
});
