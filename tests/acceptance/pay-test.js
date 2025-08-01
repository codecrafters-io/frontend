import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, visit } from '@ember/test-helpers';
/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupWindowMock(hooks);

  test('user can view the page even if not signed in', async function (assert) {
    testScenario(this.server);

    await payPage.visit();

    assert.strictEqual(currentURL(), '/pay');
  });

  test('user can view the page through the pricing link', async function (assert) {
    testScenario(this.server);

    await catalogPage.visit();

    await catalogPage.header.clickOnHeaderLink('Pricing');
    assert.strictEqual(currentURL(), '/pay');
  });

  test('new user can start checkout session', async function (assert) {
    testScenario(this.server);

    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page');

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();
    await percySnapshot('Pay page - configure checkout session modal');

    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount, null);
  });

  test('user with signup discount can start checkout session', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const signupDiscount = this.server.schema.promotionalDiscounts.create({
      user: user,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await payPage.visit();
    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    assert.strictEqual(payPage.modalPlanCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.true(payPage.discountNotice.isVisible, 'should show signup discount notice');
    assert.ok(
      payPage.discountNotice.text.match(/^40% off — Signup discount, expires in \d{2}h:\d{2}m:\d{2}s$/),
      'should show signup discount notice text',
    );
    await percySnapshot('Pay page - with early bird discount');

    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, signupDiscount.id);
  });

  test('user with stage2 discount can start checkout session', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const stage2CompletionDiscount = this.server.schema.promotionalDiscounts.create({
      user: user,
      type: 'stage_2_completion',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await payPage.visit();
    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    assert.strictEqual(payPage.modalPlanCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.true(payPage.discountNotice.isVisible, 'should show stage 2 completion discount notice');
    await percySnapshot('Pay page - with stage 2 completion discount');
    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, stage2CompletionDiscount.id);
  });

  test('user with referral discount and signup discount sees referral discount', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const signupDiscount = this.server.schema.promotionalDiscounts.create({
      user: user,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    const affiliateLink = this.server.create('affiliate-link', {
      user: user,
    });

    const affiliateReferral = this.server.create('affiliate-referral', {
      activatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      affiliateLink: affiliateLink,
      customer: user,
      referrer: user,
    });

    const referralDiscount = this.server.schema.promotionalDiscounts.create({
      affiliateReferral: affiliateReferral,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      percentageOff: 40,
      type: 'affiliate_referral',
      user: user,
    });

    await payPage.visit();
    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    assert.true(payPage.discountNotice.isVisible, 'should show referral discount notice');
    assert.strictEqual(payPage.modalPlanCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.ok(payPage.discountNotice.text.match(/^40% off — rohitpaulk's referral offer, expires in \d{2}h:\d{2}m:\d{2}s$/));
    await percySnapshot('Pay page - with referral discount');

    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, referralDiscount.id);
    assert.notStrictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, signupDiscount.id);
  });

  // TODO: Add test for only referral discount

  test('user can create checkout session with regional discount applied', async function (assert) {
    testScenario(this.server);

    signIn(this.owner, this.server);
    const regionalDiscount = this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    await payPage.visit();

    await payPage.clickOnApplyRegionalDiscountButton();

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    assert.strictEqual(payPage.modalPlanCards[1].discountedPriceText, '$180', 'should show discounted price');
    assert.true(payPage.modalPlanCards[1].regionalDiscountNotice.isVisible, 'should show regional discount notice');
    assert.ok(payPage.modalPlanCards[1].regionalDiscountNotice.text.match(/^50% off — India discount$/));
    await percySnapshot('Pay page - with regional discount');

    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount, null);
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().regionalDiscount.id, regionalDiscount.id);
  });

  test('user can create checkout session when extra invoice details is not requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    await payPage.clickOnChoosePlanButton();
    await payPage.clickOnProceedToCheckoutButton();

    assert.false(this.server.schema.individualCheckoutSessions.first().extraInvoiceDetailsRequested);
  });

  test('user can create checkout session when extra invoice details is requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.modalPlanCards[1].click();
    await payPage.clickOnChoosePlanButton();
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

  test('user should be redirected to /settings/billing if user is authenticated and has an active subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await visit('/pay');

    assert.strictEqual(currentURL(), '/settings/billing');
  });
});
