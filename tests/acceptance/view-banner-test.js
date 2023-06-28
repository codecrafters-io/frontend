import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

function createActiveSubscription(server, user) {
  const date = new Date();
  const periodEnd = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate());

  server.create('subscription', {
    user,
    startDate: date,
    pricingPlanName: 'Monthly',
    currentPeriodEnd: periodEnd
  })
}

module('Acceptance | view-banner', function(hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it does not render if a user is not signed in', async function(assert) {
    testScenario(this.server);

    await catalogPage.visit();

    const bodyText = document.body.textContent;
    assert.notOk(/Upgrade today to get 40% off/.test(bodyText), 'Discount banner is not visible');
  });
  test('it does not render if feaure flag is not set', async function(assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();

    const bodyText = document.body.textContent;
    assert.notOk(/Upgrade today to get 40% off/.test(bodyText), 'Discount banner is not visible');
  });
  test('it does not render if there are active subscriptions', async function(assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date());
    currentUser.update('featureFlags', { 'can-see-early-bird-discount-banner': 'test' })
    createActiveSubscription(this.server, currentUser);

    await catalogPage.visit();

    const bodyText = document.body.textContent;
    assert.notOk(/Upgrade today to get 40% off/.test(bodyText), 'Discount banner is not visible');
  });
  test('it does not render if the user is not eligible', async function(assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date(2019, 1, 1));
    currentUser.update('featureFlags', { 'can-see-early-bird-discount-banner': 'test' })
    createActiveSubscription(this.server, currentUser);

    await catalogPage.visit();

    const bodyText = document.body.textContent;
    assert.notOk(/Upgrade today to get 40% off/.test(bodyText), 'Discount banner is not visible');
  });
  test('it renders when user is signed in, feature flags are on, user does not have a subscription, and is eligible for discount', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const currentUser = this.server.schema.users.first();
    currentUser.update('createdAt', new Date());
    currentUser.update('featureFlags', { 'can-see-early-bird-discount-banner': 'test' })

    await catalogPage.visit();

    const bodyText = document.body.textContent;
    assert.ok(/Upgrade today to get 40% off/.test(bodyText), 'Discount banner is visible');
  });
});

