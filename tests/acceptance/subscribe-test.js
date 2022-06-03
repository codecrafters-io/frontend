import { module, skip, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import finishRender from 'codecrafters-frontend/tests/support/finish-render';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import window from 'ember-window-mock';

module('Acceptance | subscribe-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  skip('new user can start checkout session', async function () {
    // signInAsAdmin(this.owner); // TODO: Change to regular user
    // testScenario(this.server);
    //
    // let currentUser = this.server.schema.users.first();
    // let c = this.server.schema.languages.findBy({ name: 'C' });
    // let redis = this.server.schema.courses.findBy({ slug: 'redis' });
    //
    // this.server.create('repository', 'withFirstStageCompleted', {
    //   course: redis,
    //   language: c,
    //   name: 'C #1',
    //   user: currentUser,
    // });
    //
    // this.server.create('free-usage-restriction', { user: currentUser, expiresAt: new Date(new Date().getTime() + 1000) });
    //
    // await coursesPage.visit();
    // await coursesPage.clickOnCourse('Build your own Redis');
    // await coursePage.collapsedItems[3].click();
    // await coursePage.activeCourseStageItem.upgradePrompt.clickOnSubscribeButton();
    //
    // await percySnapshot('Subscribe Modal');
    //
    // await coursePage.subscribeModal.clickOnSubscribeButton();
    // assert.equal(window.location.href, 'https://test.com/checkout_session', 'Clicking subscribe button should redirect to checkout session URL');
  });

  test('new user can wait for subscriptions to sync after successful checkout session', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit({ action: 'checkout_session_successful' });

    const baseRequestsCount = [
      'fetch courses (courses listing page)',
      'fetch repositories (courses listing page)',
      'notify page view (courses listing page)',
      'fetch subscriptions (modal)',
    ].length;

    assert.ok(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should be visible');
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
    assert.notOk(coursesPage.checkoutSessionSuccessfulModal.isVisible, 'Checkout session successful modal should not be visible');

    await this.clock.tick(1001);
    await finishRender();

    assert.equal(this.server.pretender.handledRequests.length, baseRequestsCount + 2); // No more requests after polling is complete
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
