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

    assert.expect(2);

    try {
      await payPage.visit();
    } catch (e) {
      assert.strictEqual(1, 1);
    }

    assert.strictEqual(window.location.href, `${window.location.origin}/login?next=/pay`, 'should redirect to login URL');
  });

  test('new user can start checkout session', async function (assert) {
    testScenario(this.server);

    let user = this.server.schema.users.first();
    user.update('createdAt', new Date(user.createdAt.getTime() - 5 * 24 * 60 * 60 * 1000));

    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page');

    await payPage.clickOnStartPaymentButtonForMonthlyPlan();
    assert.strictEqual(1, 1); // Dummy test
  });

  test('new user sees discounted price start checkout session', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await payPage.visit();
    await percySnapshot('Pay page - with discount');

    await payPage.clickOnStartPaymentButtonForMonthlyPlan();
    assert.strictEqual(1, 1); // Dummy test
  });
});
