import { module, test } from 'qunit';
import { visit, currentURL } from '@ember/test-helpers';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | Meta tags', function (hooks) {
  setupApplicationTest(hooks);

  function createConcepts(server) {
    createConceptFromFixture(server, tcpOverview);
    createConceptFromFixture(server, networkProtocols);
  }

  hooks.beforeEach(function () {
    testScenario(this.server);
    createConcepts(this.server);
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
    const user = this.server.schema.users.first();

    this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await visit('/collections/test-concept-group');
    assert.strictEqual(currentURL(), '/collections/test-concept-group');
    assert
      .dom('meta[property="og:image"]', document.head)
      .hasAttribute('content', 'https://codecrafters.io/images/app_og/collection-test-concept-group.png');
  });
});
