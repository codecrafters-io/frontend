import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);

  test('redirects to login page if user is not signed in', async function (assert) {
    testScenario(this.server);

    /* eslint-disable-next-line qunit/require-expect */
    assert.expect(2);

    try {
      await payPage.visit();
    } catch (e) {
      assert.strictEqual(1, 1);
    }

    assert.strictEqual(
      window.location.href,
      `${window.location.origin}/login?next=http%3A%2F%2Flocalhost%3A7357%2Fpay`,
      'should redirect to login URL'
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
    assert.false(this.server.schema.individualCheckoutSessions.first().earlyBirdDiscountEnabled);
  });

  test('new user sees discounted price start checkout session', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(new Date().getTime() - 23 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    await payPage.visit();
    assert.strictEqual(payPage.pricingCards[2].discountedPriceText, '$18', 'should show discounted price');

    await percySnapshot('Pay page - with early bird discount');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    assert.true(this.server.schema.individualCheckoutSessions.first().earlyBirdDiscountEnabled);
  });

  test('new user sees discounted price if they have a referral', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000));

    this.server.create('referral-activation', {
      activatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      referrer: user,
      customer: user,
    });

    signIn(this.owner, this.server);

    await payPage.visit();
    assert.strictEqual(payPage.pricingCards[2].discountedPriceText, '$18', 'should show discounted price');

    await percySnapshot('Pay page - with referral discount');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    assert.true(this.server.schema.individualCheckoutSessions.first().referralDiscountEnabled);
  });

  test('new user sees discounted price if they have a custom discount', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000));

    this.server.create('referral-activation', {
      activatedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
      referrer: user,
      customer: user,
    });

    const customDiscount = this.server.create('custom-discount', {
      user: user,
      discountedYearlyPriceInCents: 100_00,
      expiresAt: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000),
      status: 'unused',
    });

    signIn(this.owner, this.server);

    await payPage.visit();
    assert.strictEqual(payPage.pricingCards[2].discountedPriceText, '$8.33', 'should show discounted price');

    await percySnapshot('Pay page - with custom discount');

    await payPage.clickOnStartPaymentButtonForYearlyPlan();
    assert.strictEqual(this.server.schema.individualCheckoutSessions.first().customDiscount.id, customDiscount.id);
  });
});
