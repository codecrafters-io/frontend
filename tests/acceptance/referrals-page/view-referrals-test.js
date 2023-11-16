import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | referrals-page | view-referrals', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);

  test('get 1 free week link is visible', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();

    assert.true(catalogPage.accountDropdown.hasLink('Get 1 free week'), 'expect to see Get 1 free week link');
  });

  test('get 1 free week link redirects to correct page', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.accountDropdown.toggle();
    await catalogPage.accountDropdown.clickOnLink('Get 1 free week');

    assert.strictEqual(currentURL(), '/refer', 'expect to be redirected to referrals page');
  });
});
