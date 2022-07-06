import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import payPage from 'codecrafters-frontend/tests/pages/pay-page';
import percySnapshot from '@percy/ember';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import trackPage from 'codecrafters-frontend/tests/pages/track-page';
import window from 'ember-window-mock';

module('Acceptance | pay-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('redirects to login page if user is not signed in', async function (assert) {
    testScenario(this.server);

    assert.expect(2);

    try {
      await payPage.visit();
    } catch (e) {
      assert.equal(1, 1);
    }

    assert.equal(window.location.href, `${window.location.origin}/login?next=/pay`, 'should redirect to login URL');
  });

  test('new user can start checkout session', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page');

    await payPage.clickOnStartPaymentButton();
    assert.equal(1, 1); // Dummy test
  });

  test('new user can wait for subscriptions to sync after successful checkout session', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await trackPage.visit({ track_slug: 'go', action: 'checkout_session_successful' });

    const baseRequestsCount = [
      'fetch courses (track page)',
      'fetch leaderboard entries (track page)',
      'fetch repositories (track page)',
      'notify page view (track page)',
      'notify finished checkout flow (modal)',
      'fetch subscriptions (modal)',
    ].length;

    assert.ok(trackPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should be visible');
    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount);

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 1);

    this.server.create('subscription', {
      user: this.server.schema.users.first(),
      endedAt: null,
      startDate: new Date(2021, 1, 1),
    });

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // One more subscriptions request
    assert.notOk(trackPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // No more requests after polling is complete
    assert.notOk(trackPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');
  });
});
