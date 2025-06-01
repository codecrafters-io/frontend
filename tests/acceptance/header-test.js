import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | header-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  test('header should show sign-in & pricing link if user is unauthenticated', async function (assert) {
    testScenario(this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.signInButton.isVisible, 'expect sign-in button to be visible');
    assert.true(catalogPage.header.hasLink('Pricing'), 'expect pricing link to be visible');

    await catalogPage.header.clickOnHeaderLink('Pricing');
    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to pay page');
  });

  test('header should show upgrade button if user does not have an active subscription', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.upgradeButton.isVisible, 'expect billing status  badge to be visible');
    await catalogPage.header.upgradeButton.click();

    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to pay page');
  });

  test('header should show member badge if user has an active subscription', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.memberBadge.isVisible, 'expect member badge to be visible');

    await catalogPage.header.memberBadge.hover();

    assertTooltipContent(assert, {
      contentString: "You're a CodeCrafters member. Click here to view your membership details.",
    });
  });

  test('member badge redirects to /settings/billing', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.header.memberBadge.click();

    assert.strictEqual(currentURL(), '/settings/billing', 'expect to be redirected to settings billing page');
  });
});
