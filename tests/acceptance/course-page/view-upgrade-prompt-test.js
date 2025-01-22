import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | course-page | view-upgrade-prompt', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server, ['dummy']);

    this.language = this.server.schema.languages.findBy({ slug: 'go' });
    this.course = this.server.schema.courses.findBy({ slug: 'dummy' });
    this.currentUser = signIn(this.owner, this.server);

    this.course.update({ releaseStatus: 'live' });
  });

  test('upgrade prompt should have the correct copy when the user is eligible for both signup and regional discounts', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    this.server.create('repository', 'withSecondStageCompleted', {
      course: this.course,
      language: this.language,
      user: this.currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.contains(
      coursePage.upgradePrompt.secondaryCopy,
      'Plans start at $30/month $15/month (discounted price for India) when billed annually. Save an additional 40% by joining within 60 minutes.',
    );
  });

  test('upgrade prompt should have the correct copy when the user is eligible for a signup discount', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    this.server.create('repository', 'withSecondStageCompleted', {
      course: this.course,
      language: this.language,
      user: this.currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/month when billed annually. Save 40% by joining within 60 minutes.');
  });

  test('upgrade prompt should have the correct copy when the user is eligible for a regional discount', async function (assert) {
    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    this.server.create('repository', 'withSecondStageCompleted', {
      course: this.course,
      language: this.language,
      user: this.currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/month $15/month (discounted price for India) when billed annually.');
  });

  test('upgrade prompt should have the correct copy when there are no discounts', async function (assert) {
    this.server.create('repository', 'withSecondStageCompleted', {
      course: this.course,
      language: this.language,
      user: this.currentUser,
    });

    await catalogPage.visit();
    await catalogPage.clickOnCourse('Build your own Dummy');

    assert.contains(coursePage.upgradePrompt.secondaryCopy, 'Plans start at $30/month when billed annually.');
  });
});
