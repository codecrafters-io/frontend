import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | subscribe-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('new user can start checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');
    await coursePage.collapsedItems[3].click();
    await coursePage.activeCourseStageItem.upgradePrompt.clickOnSubscribeButton();
    await coursePage.subscribeModal.clickOnSubscribeButton();

    assert.equal(window.location.href, 'https://test.com/checkout_session', 'Clicking subscribe button should redirect to checkout session URL');
  });

  test('new user can wait for subscriptions to sync after successful checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit({ action: 'checkout_session_successful' });

    assert.ok(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should be visible');
    assert.equal(this.server.pretender.handledRequests.length, 2); // Fetch courses (courses page) + fetch subscriptions

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 3); // One more subscriptions request

    this.server.create('subscription', {
      user: this.server.schema.users.first(),
      endedAt: null,
      startDate: new Date(2021, 1, 1),
    });

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 4); // One more subscriptions request
    assert.notOk(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, 4); // No more requests after polling is complete
    assert.notOk(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');
  });

  test('subscriber can manage subscription', async function (assert) {
    signInAsSubscriber(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Subscription');

    assert.equal(
      window.location.href,
      'https://test.com/billing_session',
      'Clicking manage subscription button should redirect to billing session URL'
    );
  });
});
