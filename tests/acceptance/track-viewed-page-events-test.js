import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';

module('Acceptance | track-viewed-page-events-test', function (hooks) {
  setupApplicationTest(hooks);

  test('it tracks viewed_page event on page load', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit();

    const viewedPageEvents = this.server.schema.analyticsEvents.all().models.filter((event) => {
      return event.name === 'viewed_page';
    });

    assert.strictEqual(viewedPageEvents.length, 1, 'Expected one viewed_page event on initial page load');
  });

  test('it tracks viewed_page event when returning after more than 5 minutes', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const visibilityService = this.owner.lookup('service:visibility');
    const pageViewTrackerService = this.owner.lookup('service:page-view-tracker');

    await catalogPage.visit();

    const getViewedPageEvents = () => {
      return this.server.schema.analyticsEvents.all().models.filter((event) => {
        return event.name === 'viewed_page';
      });
    };

    assert.strictEqual(getViewedPageEvents().length, 1, 'Expected one viewed_page event');

    // Simulate hiding the page - this sets lastHiddenAt to Date.now()
    visibilityService.isVisible = false;
    visibilityService.fireCallbacks();

    assert.strictEqual(getViewedPageEvents().length, 1, 'Expected one viewed_page event');

    // Directly set lastHiddenAt to 6 minutes in the past (simpler than mocking the date service)
    pageViewTrackerService.lastHiddenAt = Date.now() - 6 * 60 * 1000;

    visibilityService.isVisible = true;
    visibilityService.fireCallbacks();

    waitUntil(() => getViewedPageEvents().length === 2);
  });
});
