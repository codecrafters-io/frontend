import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { clearAllCookies } from 'ember-cookies/test-support';
import { serializeCookie } from 'ember-cookies/utils/serialize-cookie';

module('Acceptance | utm-campaign', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

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

    await coursesPage.visit({ r: '3bc' });
    assert.strictEqual(currentURL(), '/courses');

    assert.strictEqual(this.server.schema.analyticsEvents.first().name, 'viewed_page');
    assert.strictEqual(this.server.schema.analyticsEvents.first().properties.utm_campaign_id, '3bc');

    await coursesPage.courseCards[0].click();
    assert.strictEqual(currentURL(), '/courses/redis/overview');

    assert.strictEqual(this.server.schema.analyticsEvents.first().name, 'viewed_page');
    assert.strictEqual(this.server.schema.analyticsEvents.first().properties.utm_campaign_id, '3bc');
  });

  test('it does not remove query param unless matches pattern', async function (assert) {
    testScenario(this.server);
    signIn(this.owner, this.server);

    await coursesPage.visit({ r: 'dummy' });
    assert.strictEqual(currentURL(), '/courses?r=dummy');

    assert.strictEqual(this.server.schema.analyticsEvents.first().name, 'viewed_page');
    assert.notOk(this.server.schema.analyticsEvents.first().properties.utm_campaign_id);
  });
});
