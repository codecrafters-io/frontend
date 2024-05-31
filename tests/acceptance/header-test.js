import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | header-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

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

  test('member badge redirects to /membership', async function (assert) {
    testScenario(this.server);
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.header.memberBadge.click();

    assert.strictEqual(currentURL(), '/membership', 'expect to be redirected to membership page');
  });
});
