import { module, test } from 'qunit';
import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsSubscriber, signInAsTrialingSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import tracksPage from 'codecrafters-frontend/tests/pages/tracks-page';
import moment from 'moment';
import membershipPage from 'codecrafters-frontend/tests/pages/membership-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';
import { currentURL } from '@ember/test-helpers';

module('Acceptance | manage-membership-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('subscriber can manage membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await tracksPage.visit();
    await tracksPage.accountDropdown.toggle();
    await tracksPage.accountDropdown.clickOnLink('Manage Membership');

    assert.equal(currentURL(), '/membership');
    await animationsSettled();
  });

  test('subscriber can cancel trial', async function (assert) {
    testScenario(this.server);
    signInAsTrialingSubscriber(this.owner, this.server);

    window.confirm = () => true;

    await membershipPage.visit();
    assert.equal(membershipPage.membershipPlanSection.descriptionText, 'Your trial for the Monthly plan is currently active.');

    await membershipPage.clickOnCancelTrialButton();
    assert.equal(membershipPage.membershipPlanSection.descriptionText, 'Your CodeCrafters membership is currently inactive.');

    await animationsSettled();
  });

  test('subscriber can cancel subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let subscription = this.server.schema.subscriptions.first();

    window.confirm = () => true;

    await membershipPage.visit();
    assert.equal(membershipPage.membershipPlanSection.descriptionText, 'You are currently subscribed to the Monthly plan.');

    await membershipPage.clickOnCancelSubscriptionButton();

    assert.equal(
      membershipPage.membershipPlanSection.descriptionText,
      `Your CodeCrafters membership is valid until ${moment(subscription.currentPeriodEnd).format('LLL')}.`
    );

    await animationsSettled();
  });

  test('subscriber can view recent payments', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    let subscription = this.server.schema.subscriptions.first();

    this.server.schema.charges.create({
      user: subscription.user,
      amount: 7900,
      currency: 'usd',
      createdAt: new Date(),
      invoiceId: 'invoice-id',
    });

    this.server.schema.charges.create({
      user: subscription.user,
      amount: 3500,
      currency: 'usd',
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 7),
      invoiceId: 'invoice-id',
    });

    window.confirm = () => true;

    await membershipPage.visit();
    await animationsSettled();

    assert.equal(membershipPage.recentPaymentsSection.downloadInvoiceLinks.length, 2);
  });
});
