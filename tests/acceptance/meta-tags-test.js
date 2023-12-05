import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | Meta tags', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  hooks.beforeEach(function () {
    testScenario(this.server);
  });

  test('it has default meta image when visiting /catalog', async function (assert) {
    await visit('/catalog');
    assert.strictEqual(currentURL(), '/catalog');
    assert.dom('meta[property="og:image"]', document.head).hasAttribute('content', 'https://codecrafters.io/images/og-index.jpg');
  });

  test('it has custom meta image when visiting a course page', async function (assert) {
    await visit('/courses/redis/overview');
    assert.strictEqual(currentURL(), '/courses/redis/overview');
    assert.dom('meta[property="og:image"]', document.head).hasAttribute('content', 'https://codecrafters.io/images/app_og/course-redis.jpg');
  });

  test('it has custom meta image when visiting a track page', async function (assert) {
    await visit('/tracks/go');
    assert.strictEqual(currentURL(), '/tracks/go');
    assert.dom('meta[property="og:image"]', document.head).hasAttribute('content', 'https://codecrafters.io/images/app_og/language-go.jpg');
  });

  test('it has custom meta image when visiting a collection', async function (assert) {
    await visit('/collections/rust-primer');
    assert.strictEqual(currentURL(), '/collections/rust-primer');
    assert
      .dom('meta[property="og:image"]', document.head)
      .hasAttribute('content', 'https://codecrafters.io/images/app_og/collection-rust-primer.png');
  });
});
