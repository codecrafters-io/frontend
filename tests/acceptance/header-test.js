import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { assertTooltipContent } from 'ember-tooltips/test-support';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupAnimationTest } from 'ember-animated/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn, signInAsSubscriber, signInAsInstitutionMembershipGrantRecipient } from 'codecrafters-frontend/tests/support/authentication-helpers';
import createInstitution from 'codecrafters-frontend/mirage/utils/create-institution';

module('Acceptance | header-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);

    for (const language of this.server.schema.languages.all().models) {
      language.update({ leaderboard: this.server.create('leaderboard', { highestPossibleScore: 237 }) });
    }
  });

  test('header should show sign-in & pricing link if user is unauthenticated', async function (assert) {
    await catalogPage.visit();

    assert.true(catalogPage.header.signInButton.isVisible, 'expect sign-in button to be visible');
    assert.true(catalogPage.header.hasLink('Pricing'), 'expect pricing link to be visible');

    await catalogPage.header.clickOnHeaderLink('Pricing');
    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to pay page');
  });

  test('header should show leaderboard link if user is authenticated and has feature flag enabled', async function (assert) {
    const user = signIn(this.owner, this.server);
    user.update('featureFlags', { 'should-see-leaderboard': 'true' });

    await catalogPage.visit();
    assert.true(catalogPage.header.hasLink('Leaderboard'), 'expect leaderboard link to be visible');

    await catalogPage.header.clickOnHeaderLink('Leaderboard');
    assert.strictEqual(currentURL(), '/leaderboards/rust', 'expect to be redirected to rust leaderboard page by default');
  });

  test('header should show upgrade button if user does not have an active subscription', async function (assert) {
    signIn(this.owner, this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.upgradeButton.isVisible, 'expect billing status  badge to be visible');
    await catalogPage.header.upgradeButton.click();

    assert.strictEqual(currentURL(), '/pay', 'expect to be redirected to pay page');
  });

  test('header should show member badge if user has an active subscription', async function (assert) {
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.memberBadge.isVisible, 'expect member badge to be visible');

    await catalogPage.header.memberBadge.hover();

    assertTooltipContent(assert, {
      contentString: "You're a CodeCrafters member. Click here to view your membership details.",
    });
  });

  test('member badge redirects to /settings/billing', async function (assert) {
    signInAsSubscriber(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.header.memberBadge.click();

    assert.strictEqual(currentURL(), '/settings/billing', 'expect to be redirected to settings billing page');
  });

  test('header should show campus badge if user has an institution membership grant', async function (assert) {
    createInstitution(this.server, 'nus');
    signInAsInstitutionMembershipGrantRecipient(this.owner, this.server);

    await catalogPage.visit();

    assert.true(catalogPage.header.campusBadge.isVisible, 'expect campus badge to be visible');

    await catalogPage.header.campusBadge.hover();

    assertTooltipContent(assert, {
      contentString: "You're part of the CodeCrafters Campus Program. Click here to view your membership details.",
    });
  });

  test('campus badge redirects to /settings/billing', async function (assert) {
    createInstitution(this.server, 'nus');
    signInAsInstitutionMembershipGrantRecipient(this.owner, this.server);

    await catalogPage.visit();
    await catalogPage.header.campusBadge.click();

    assert.strictEqual(currentURL(), '/settings/billing', 'expect to be redirected to settings billing page');
  });
});
