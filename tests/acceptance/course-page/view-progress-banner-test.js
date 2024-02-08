import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signInAsStaff } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-progress-banner', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('can view progress banner', async function (assert) {
    testScenario(this.server);
    signInAsStaff(this.owner, this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
      createdAt: new Date(2002),
      progressBannerUrl: '/assets/images/svg-icons/spinner.svg',
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Redis');

    await coursePage.repositoryDropdown.click();
    await coursePage.repositoryDropdown.clickOnAction('Progress Banner');

    assert.ok(coursePage.progressBannerModal.isVisible);
  });
});
