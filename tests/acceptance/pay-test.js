import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, visit } from '@ember/test-helpers';
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
    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await percySnapshot('Pay page - Choose membership plan modal - Invoice details step');
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();

    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount, null);
  });

  test('user with signup discount can start checkout session', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const signupDiscount = this.server.create('promotional-discount', {
      userId: user.id,
      type: 'signup',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await payPage.visit();
    assert.true(payPage.signupDiscountNotice.isVisible, 'should show page-level signup discount notice');
    assert.ok(payPage.signupDiscountNotice.text.match(/^New user offer: Subscribe in \d{2}h:\d{2}m:\d{2}s to get 40% off the annual plan\.$/));

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    assert.strictEqual(payPage.chooseMembershipPlanModal.planCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.true(payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.isVisible, 'should show signup discount notice');
    assert.ok(
      payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.text.match(
        /^40% off — Signup discount, expires in \d{2}h:\d{2}m:\d{2}s$/,
      ),
    );
    await percySnapshot('Pay page - with signup discount');

    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, signupDiscount.id);
  });

  test('user with stage2 discount can start checkout session', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const stage2CompletionDiscount = this.server.create('promotional-discount', {
      userId: user.id,
      type: 'stage_2_completion',
      percentageOff: 40,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await payPage.visit();
    assert.true(payPage.stage2CompletionDiscountNotice.isVisible, 'should show page-level stage 2 completion discount notice');
    assert.ok(payPage.stage2CompletionDiscountNotice.text.match(/stage 2.*40%/i), 'should show stage 2 completion discount details on page');

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    assert.strictEqual(payPage.chooseMembershipPlanModal.planCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.true(payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.isVisible, 'should show stage 2 completion discount notice');
    await percySnapshot('Pay page - with stage 2 completion discount');
    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();
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
      affiliateName: 'rohitpaulk',
      affiliateAvatarUrl: 'https://avatars.githubusercontent.com/u/1234567890?v=4',
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
    assert.true(payPage.referralDiscountNotice.isVisible, 'should show page-level referral discount notice');
    assert.ok(payPage.referralDiscountNotice.text.match(/referral.*40%/i), 'should show referral discount details on page');

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    assert.true(payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.isVisible, 'should show referral discount notice');
    assert.strictEqual(payPage.chooseMembershipPlanModal.planCards[1].discountedPriceText, '$216', 'should show discounted price');
    assert.ok(
      payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.text.match(
        /^40% off — rohitpaulk's referral offer, expires in \d{2}h:\d{2}m:\d{2}s$/,
      ),
    );
    await percySnapshot('Pay page - with referral discount');

    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, referralDiscount.id);
    assert.notStrictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, signupDiscount.id);
  });

  test('user with early renewal discount can start checkout session', async function (assert) {
    testScenario(this.server);

    const user = signIn(this.owner, this.server);

    const earlyRenewalDiscount = this.server.create('promotional-discount', {
      userId: user.id,
      type: 'membership_expiry',
      percentageOff: 50,
      expiresAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    });

    await payPage.visit();
    assert.true(payPage.earlyRenewalDiscountNotice.isVisible, 'should show page-level early renewal discount notice');
    assert.ok(payPage.earlyRenewalDiscountNotice.text.match(/early renewal.*50%/i), 'should show early renewal discount details on page');

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    assert.strictEqual(payPage.chooseMembershipPlanModal.planCards[1].discountedPriceText, '$180', 'should show discounted price');
    assert.true(
      payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.isVisible,
      'should show early renewal discount notice in modal',
    );
    assert.ok(
      payPage.chooseMembershipPlanModal.planCards[1].promotionalDiscountNotice.text.match(
        /^50% off — Early renewal discount, expires in \d{2}h:\d{2}m:\d{2}s$/,
      ),
    );

    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount.id, earlyRenewalDiscount.id);
  });

  // TODO: Add test for only referral discount

  test('user can create checkout session with regional discount applied', async function (assert) {
    testScenario(this.server);

    signIn(this.owner, this.server);
    const regionalDiscount = this.server.create('regional-discount', { percentOff: 50, countryName: 'India', id: 'current-discount-id' });

    await payPage.visit();
    assert.true(payPage.pageRegionalDiscountNotice.isVisible, 'should show page-level regional discount notice');
    assert.ok(payPage.pageRegionalDiscountNotice.text.match(/India.*50%/), 'should show regional discount details on page');

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    assert.strictEqual(payPage.chooseMembershipPlanModal.planCards[1].discountedPriceText, '$180', 'should show discounted price');
    assert.true(payPage.chooseMembershipPlanModal.planCards[1].regionalDiscountNotice.isVisible, 'should show regional discount notice');
    assert.ok(payPage.chooseMembershipPlanModal.planCards[1].regionalDiscountNotice.text.match(/^50% off — India discount$/));
    await percySnapshot('Pay page - with regional discount');

    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().promotionalDiscount, null);
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().regionalDiscount.id, regionalDiscount.id);
  });

  test('user can create checkout session when extra invoice details is not requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();

    assert.false(this.server.schema.individualCheckoutSessions.first().extraInvoiceDetailsRequested);
  });

  test('user can create checkout session when extra invoice details is requested', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    await payPage.pricingPlanCards[1].ctaButton.click();
    await payPage.chooseMembershipPlanModal.planCards[1].click();
    await payPage.chooseMembershipPlanModal.clickOnChoosePlanButton();
    await payPage.chooseMembershipPlanModal.clickOnExtraInvoiceDetailsToggle();

    await percySnapshot('Pay page - Choose membership plan modal - Invoice details step (extra details toggled)');

    await payPage.chooseMembershipPlanModal.clickOnProceedToCheckoutButton();

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

  test('navigating to /pay?plans=true opens the membership plan modal', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/pay?plans=true');

    assert.strictEqual(currentURL(), '/pay?plans=true');
    assert.true(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is visible');
  });

  test('clicking "View plans" button adds plans query param and opens modal', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();

    assert.strictEqual(currentURL(), '/pay');
    assert.false(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is not visible initially');

    await payPage.pricingPlanCards[1].ctaButton.click();

    assert.strictEqual(currentURL(), '/pay?plans=true');
    assert.true(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is visible after clicking View plans');
  });

  test('closing modal via backdrop removes plans query param', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/pay?plans=true');

    assert.true(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is visible');
    assert.strictEqual(currentURL(), '/pay?plans=true');

    await payPage.clickOnModalBackdrop();

    assert.false(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is not visible after closing');
    assert.strictEqual(currentURL(), '/pay', 'plans query param is removed from URL');
  });

  test('closing modal via "Back to pricing page" link removes plans query param', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await visit('/pay?plans=true');

    assert.true(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is visible');
    assert.strictEqual(currentURL(), '/pay?plans=true');

    await payPage.chooseMembershipPlanModal.clickOnCloseModalCTA();

    assert.false(payPage.chooseMembershipPlanModal.isVisible, 'membership plan modal is not visible after closing');
    assert.strictEqual(currentURL(), '/pay', 'plans query param is removed from URL');
  });
});
