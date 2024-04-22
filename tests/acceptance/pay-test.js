import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('user can view the page even if not signed in', async function (assert) {
    testScenario(this.server);

    await payPage.visit();

    assert.strictEqual(currentURL(), '/pay');

    await payPage.pricingCards[0].startPaymentButton.hover();

    assertTooltipContent(assert, {
      contentString: 'Login via GitHub to start a membership.',
    });
  });

  test('new user can start checkout session', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(user.createdAt.getTime() - 5 * 24 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();

    await percySnapshot('Pay page - configure checkout session modal');

    await payPage.clickOnProceedToCheckoutButton();

    assert.false(this.server.schema.individualCheckoutSessions.first().earlyBirdDiscountEnabled);
  });

  test('new user sees discounted price start checkout session', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    await payPage.visit();
    assert.strictEqual(payPage.pricingCards[1].discountedPriceText, '$216', 'should show discounted price');

    await percySnapshot('Pay page - with early bird discount');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    await payPage.clickOnProceedToCheckoutButton();
    assert.true(this.server.schema.individualCheckoutSessions.first().earlyBirdDiscountEnabled);
  });

  test('new user sees discounted price if they have a referral', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000));

    this.server.create('affiliate-referral', {
      activatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      referrer: user,
      customer: user,
    });

    signIn(this.owner, this.server);

    await payPage.visit();
    assert.strictEqual(payPage.pricingCards[1].discountedPriceText, '$216', 'should show discounted price');

    await percySnapshot('Pay page - with referral discount');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    await payPage.clickOnProceedToCheckoutButton();
    assert.true(this.server.schema.individualCheckoutSessions.first().referralDiscountEnabled);
  });

  test('user can create checkout session with regional discount applied', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(user.createdAt.getTime() - 5 * 24 * 60 * 60 * 1000));

    this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page - with regional discount (not applied)');

    await payPage.clickOnApplyRegionalDiscountButton();
    await percySnapshot('Pay page - with regional discount (applied)');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    await payPage.clickOnProceedToCheckoutButton();
    assert.false(this.server.schema.individualCheckoutSessions.first().earlyBirdDiscountEnabled);
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().regionalDiscountId, 'current-discount-id');
  });

  test('user can create checkout session when extra invoice details is not requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    await payPage.clickOnProceedToCheckoutButton();

    assert.false(this.server.schema.individualCheckoutSessions.first().extraInvoiceDetailsRequested);
  });

  test('user can create checkout session when extra invoice details is requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    await payPage.clickOnExtraInvoiceDetailsToggle();

    await percySnapshot('Pay page - configure checkout session modal (toggled)');

    await payPage.clickOnProceedToCheckoutButton();

    assert.true(this.server.schema.individualCheckoutSessions.first().extraInvoiceDetailsRequested);
  });

  test('user can logout from pay page (regression)', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();
    await payPage.accountDropdown.toggle();
    await payPage.accountDropdown.clickOnLink('Logout');

    assert.strictEqual(currentURL(), '/catalog');
  });
});
