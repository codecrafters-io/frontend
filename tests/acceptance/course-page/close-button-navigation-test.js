import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | close-button-navigation', function (hooks) {
  setupApplicationTest(hooks);

  test('close button navigates to track page when track parameter is set', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.clickOnTrack('Python');
    await trackPage.clickOnCourseCard('Build your own Dummy →');

    assert.contains(currentURL(), '/courses/dummy/introduction?track=python', 'current URL includes track parameter');

    await coursePage.header.clickOnCloseCourseButton();

    assert.strictEqual(currentURL(), '/tracks/python', 'should navigate to Python track page');
  });

  test('close button navigates to track page when active repository has submissions', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const user = this.server.schema.users.first();
    const ruby = this.server.schema.languages.findBy({ slug: 'ruby' });
    const course = this.server.schema.courses.findBy({ slug: 'dummy' });

    this.server.create('repository', 'withFirstStageCompleted', {
      user,
      language: ruby,
      course: course,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.contains(currentURL(), '/courses/dummy/stages/lr7', 'should be on course page');

    await coursePage.header.clickOnCloseCourseButton();

    assert.strictEqual(currentURL(), '/tracks/ruby', 'should navigate to Ruby track page based on repository language');
  });

  test('close button navigates to catalog when no track context exists', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursePage.visit({ course_slug: 'dummy', course_stage_slug: 'introduction' });

    assert.contains(currentURL(), '/courses/dummy/introduction', 'should be on course page');

    await coursePage.header.clickOnCloseCourseButton();

    assert.strictEqual(currentURL(), '/catalog', 'should navigate to catalog as fallback');
  });
});
