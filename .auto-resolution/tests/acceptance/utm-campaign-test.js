import catalogPage from 'codecrafters-frontend/tests/pages/catalog-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { clearAllCookies } from 'ember-cookies/test-support';

module('Acceptance | utm-campaign', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    clearAllCookies();

    let cookies = document.cookie.split(';');

    // TODO: Try to upstream this?
    cookies.forEach((cookie) => {
      let cookieName = cookie.split('=')[0].trim();
      document.cookie = cookieName + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/;';
    });
  });

  test('it removes query param and persists', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await catalogPage.visit({ r: '3bc' });
    assert.strictEqual(currentURL(), '/catalog');

    const lastViewedPageEvent = () => {
      return this.server.schema.analyticsEvents.all().models.find((event) => {
        return event.name === 'viewed_page';
      });
    };

    assert.strictEqual(lastViewedPageEvent().properties.utm_id, '3bc');

    await catalogPage.courseCardByName('Build your own Redis').click();
    assert.strictEqual(currentURL(), '/courses/redis/overview');

    assert.strictEqual(lastViewedPageEvent().properties.utm_id, '3bc');
  });

  test('it does not remove query param unless matches pattern', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    const lastViewedPageEvent = () => {
      return this.server.schema.analyticsEvents.all().models.find((event) => {
        return event.name === 'viewed_page';
      });
    };

    await catalogPage.visit({ r: 'dummy' });
    assert.strictEqual(currentURL(), '/catalog?r=dummy');

    assert.strictEqual(lastViewedPageEvent().properties.utm_id, undefined);
  });
});
