import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { currentURL, visit } from '@ember/test-helpers';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';

module('Acceptance | view-discount-countdown', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(async function () {
    testScenario(this.server);
    this.currentUser = signIn(this.owner, this.server);
  });

  test('it redirects to /tracks page', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    await visit('/');
    assert.strictEqual(currentURL(), '/catalog');
  });

  test('discount timer badge is visible in header when discount is active', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
    });

    await catalogPage.visit();
    // TODO:
    // CANT USE assert.dom in tests
    assert.dom('[data-test-discount-timer-badge]').exists('Discount timer badge is visible');
    assert.dom('[data-test-discount-timer-badge]').hasText('1 hour left', 'Shows correct time remaining');
  });

  test('discount timer badge shows correct tooltip', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 30 * 60 * 1000), // 30 minutes from now
    });

    await catalogPage.visit();
    await catalogPage.header.discountTimerBadge.hover();

    assertTooltipContent(assert, {
      contentString: 'Upgrade in 30m:00s to get 40% off the annual plan. Click to view details.',
    });
  });

  test('discount timer badge redirects to payment page when clicked', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    await catalogPage.visit();
    await catalogPage.header.discountTimerBadge.click();

    assert.strictEqual(currentURL(), '/pay', 'Redirects to payment page when clicked');
  });

  test('discount timer badge appears in both catalog and course pages', async function (assert) {
    this.server.schema.promotionalDiscounts.create({
      user: this.currentUser,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
    });

    // Check catalog page
    await catalogPage.visit();
    assert.dom('[data-test-discount-timer-badge]').exists('Badge visible on catalog page');
    assert.dom('[data-test-discount-timer-badge]').hasClass(/px-1\.5/, 'Has small size on catalog page');

    // Check course page
    await catalogPage.clickOnCourse('Build your own Redis');
    assert.dom('[data-test-discount-timer-badge]').exists('Badge visible on course page');
    assert.dom('[data-test-discount-timer-badge]').hasClass(/px-1\.5/, 'Has small size on course page');

    await coursePage.visit({ course_slug: 'redis' });
    assert.dom('[data-test-discount-timer-badge]').exists('Badge visible on course page');
    assert.dom('[data-test-discount-timer-badge]').hasClass(/px-2/, 'Has large size on course page');
  });

  test('discount timer badge is not visible when no active discount', async function (assert) {
    await catalogPage.visit();
    assert.dom('[data-test-discount-timer-badge]').doesNotExist('Discount timer badge is not visible without active discount');
  });
});
