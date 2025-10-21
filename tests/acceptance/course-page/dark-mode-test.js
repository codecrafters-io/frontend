import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';

module('Acceptance | course-page | dark-mode', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('free users can view upgrade prompt', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction', 'current URL is course page URL');

    assert.ok(coursePage.header.darkModeToggle.lightOptionIsSelected, 'light option is selected');
    assert.notOk(coursePage.upgradeModal.isVisible, 'upgrade modal is not present');

    // Clicking on the dark mode toggle should open the upgrade modal
    await coursePage.header.darkModeToggle.clickOnDarkOption();
    assert.ok(coursePage.upgradeModal.isVisible, 'upgrade modal is present');
    assert.ok(coursePage.header.darkModeToggle.lightOptionIsSelected, 'light option is selected');

    // Clicking on the backdrop should close the upgrade modal
    await coursePage.clickOnModalBackdrop();
    assert.notOk(coursePage.upgradeModal.isVisible, 'upgrade modal is not present');
    assert.ok(coursePage.header.darkModeToggle.lightOptionIsSelected, 'light option is selected');
  });

  test('paid users can toggle dark mode', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    const course = this.server.schema.courses.findBy({ slug: 'dummy' });
    course.update({ releaseStatus: 'live' });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');
    await courseOverviewPage.clickOnStartCourse();

    assert.strictEqual(currentURL(), '/courses/dummy/introduction', 'current URL is course page URL');

    assert.notOk(coursePage.upgradeModal.isVisible, 'upgrade modal is not present');
    assert.ok(coursePage.header.darkModeToggle.lightOptionIsSelected, 'light option is selected');

    // Clicking on the dark mode toggle should open the upgrade modal
    await coursePage.header.darkModeToggle.clickOnDarkOption();
    assert.notOk(coursePage.upgradeModal.isVisible, 'upgrade modal is present');
    assert.ok(coursePage.header.darkModeToggle.darkOptionIsSelected, 'dark option is selected');
  });
});
