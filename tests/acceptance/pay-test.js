/* eslint-disable qunit/require-expect */
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import windowMock from 'ember-window-mock';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('redirects to login page if user is not signed in', async function (assert) {
    testScenario(this.server);

    assert.expect(2);

    try {
      await payPage.visit();
    } catch (e) {
      assert.strictEqual(1, 1);
    }

    assert.strictEqual(
      windowMock.location.href,
      `${windowMock.location.origin}/login?next=http%3A%2F%2Flocalhost%3A${window.location.port}%2Fpay`,
      'should redirect to login URL',
    );
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
});
