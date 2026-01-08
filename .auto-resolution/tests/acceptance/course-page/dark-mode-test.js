import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';

module('Acceptance | course-page | dark-mode', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('can toggle dark mode', async function (assert) {
    testScenario(this.server, ['dummy']);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction', 'current URL is course page URL');

    assert.ok(coursePage.header.darkModeToggle.darkOptionIsSelected, 'dark option is selected');

    await coursePage.header.darkModeToggle.clickOnLightOption();
    assert.ok(coursePage.header.darkModeToggle.lightOptionIsSelected, 'light option is selected');
  });
});
