import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('new user can start checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await payPage.visit();
    await percySnapshot('Pay page');

    await payPage.clickOnStartPaymentButton();
    assert.equal(1, 1); // Dummy test
  });

  // test('new user can wait for subscriptions to sync after successful checkout session', async function (assert) {
  //   signIn(this.owner);
  //   testScenario(this.server);
  //
  //   await coursesPage.visit({ action: 'checkout_session_successful' });
  //
  //   const baseRequestsCount = [
  //     'fetch courses (courses listing page)',
  //     'fetch repositories (courses listing page)',
  //     'notify page view (courses listing page)',
  //     'fetch subscriptions (modal)',
  //   ].length;
  //
  //   assert.ok(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should be visible');
  //   assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount);
  //
  //   await this.clock.tick(1001);
  //   await finishRender();
  //
  //   assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 1);
  //
  //   this.server.create('subscription', {
  //     user: this.server.schema.users.first(),
  //     endedAt: null,
  //     startDate: new Date(2021, 1, 1),
  //   });
  //
  //   await this.clock.tick(1001);
  //   await finishRender();
  //
  //   assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // One more subscriptions request
  //   assert.notOk(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');
  //
  //   await this.clock.tick(1001);
  //   await finishRender();
  //
  //   assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // No more requests after polling is complete
  //   assert.notOk(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');
  // });
  //
  // test('subscriber can manage subscription', async function (assert) {
  //   signInAsSubscriber(this.owner);
  //   testScenario(this.server);
  //
  //   await coursesPage.visit();
  //   await coursesPage.accountDropdown.toggle();
  //   await coursesPage.accountDropdown.clickOnLink('Manage Subscription');
  //
  //   assert.equal(
  //     window.location.href,
  //     'https://test.com/billing_session',
  //     'Clicking manage subscription button should redirect to billing session URL'
  //   );
  // });
});
