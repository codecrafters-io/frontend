import { currentURL } from '@ember/test-helpers';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { module, test } from 'qunit';

module('Acceptance | view-product-walkthrough-suggestion', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders suggestion if user has it', async function (assert) {
    testScenario(this.server);
    const user = await signIn(this.owner, this.server);

    this.server.create('feature-suggestion', { user: user, featureSlug: 'product-walkthrough' });
    this.server.create('concept', { slug: 'overview', blocks: [] });

    await catalogPage.visit();
    await catalogPage.productWalkthroughFeatureSuggestion.clickOnStartHereButton();
    assert.strictEqual(currentURL(), '/concepts/overview');
  });

  test('it can be dismissed', async function (assert) {
    testScenario(this.server);
    const user = await signIn(this.owner, this.server);

    let featureSuggestion = this.server.create('feature-suggestion', { user: user, featureSlug: 'product-walkthrough' });

    await catalogPage.visit();

    assert.true(catalogPage.productWalkthroughFeatureSuggestion.isVisible);
    await catalogPage.productWalkthroughFeatureSuggestion.clickOnDismissButton();
    assert.false(catalogPage.productWalkthroughFeatureSuggestion.isVisible);

    assert.strictEqual(currentURL(), '/catalog');

    featureSuggestion = this.server.schema.featureSuggestions.find(featureSuggestion.id);
    assert.ok(featureSuggestion.dismissedAt, 'dismissedAt is set');
  });
});
