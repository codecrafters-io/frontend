import { module, test } from 'qunit';
import { currentURL, visit } from '@ember/test-helpers';
import { getPageTitle } from 'ember-page-title/test-support';
import { setupApplicationTest } from 'codecrafters-frontend/tests/helpers';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
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

  test('it has a canonical URL when visiting /catalog', async function (assert) {
    await visit('/catalog');
    assert.dom('link[rel="canonical"]', document.head).hasAttribute('href', 'https://app.codecrafters.io/catalog');
    assert.dom('meta[property="og:url"]', document.head).hasAttribute('content', 'https://app.codecrafters.io/catalog');
  });

  test('it has a canonical URL when visiting a track page', async function (assert) {
    await visit('/tracks/go');
    assert.dom('link[rel="canonical"]', document.head).hasAttribute('href', 'https://app.codecrafters.io/tracks/go');
  });

  test('it drops query params from the canonical URL of a course page', async function (assert) {
    await visit('/courses/redis/overview?track=go');
    assert.strictEqual(currentURL(), '/courses/redis/overview?track=go');
    assert.dom('link[rel="canonical"]', document.head).hasAttribute('href', 'https://app.codecrafters.io/courses/redis/overview');
    assert.dom('meta[name="robots"]', document.head).doesNotExist();
  });

  test('it hides alpha course pages from search engines', async function (assert) {
    await visit('/courses/dummy/overview');
    assert.dom('meta[name="robots"]', document.head).hasAttribute('content', 'noindex');
    assert.dom('link[rel="canonical"]', document.head).doesNotExist();
  });

  test('it lets search engines index pages visited after an alpha course page', async function (assert) {
    await visit('/courses/dummy/overview');
    await visit('/catalog');
    assert.dom('meta[name="robots"]', document.head).doesNotExist();
    assert.dom('link[rel="canonical"]', document.head).hasAttribute('href', 'https://app.codecrafters.io/catalog');
  });

  test('it has no canonical URL on pages that require login', async function (assert) {
    signIn(this.owner, this.server);

    await visit('/settings/profile');
    assert.dom('meta[name="robots"]', document.head).hasAttribute('content', 'noindex');
    assert.dom('link[rel="canonical"]', document.head).doesNotExist();
  });

  test('it has no canonical URL on the 404 page', async function (assert) {
    await visit('/this-page-does-not-exist');
    assert.dom('link[rel="canonical"]', document.head).doesNotExist();
  });

  test('it has a page-specific title and description on track pages', async function (assert) {
    await visit('/tracks/go');
    assert.strictEqual(getPageTitle(), 'Go Projects: Build Redis, Git, SQLite & More | CodeCrafters');
    assert.dom('meta[property="og:title"]', document.head).hasAttribute('content', 'Go Projects: Build Redis, Git, SQLite & More');

    assert
      .dom('meta[name="description"]', document.head)
      .hasAttribute(
        'content',
        'Master Go by building Redis, Git, SQLite, and 1 more real-world project from scratch. Advanced, test-driven challenges for experienced engineers.',
      );
  });

  test('it names every course in the title of a track with few courses', async function (assert) {
    await visit('/tracks/crystal');
    assert.strictEqual(getPageTitle(), 'Crystal Projects: Build Redis | CodeCrafters');

    assert
      .dom('meta[name="description"]', document.head)
      .hasAttribute('content', 'Master Crystal by building Redis from scratch. Advanced, test-driven challenges for experienced engineers.');
  });

  test('it has a page-specific description on course overview pages', async function (assert) {
    await visit('/courses/redis/overview');
    assert.strictEqual(getPageTitle(), 'Build your own Redis | CodeCrafters');
    assert.dom('meta[property="og:title"]', document.head).hasAttribute('content', 'Build your own Redis');

    assert
      .dom('meta[name="description"]', document.head)
      .hasAttribute(
        'content',
        'Build your own Redis from scratch. Learn about TCP servers, the Redis protocol and more. Available in Rust, Go, Python, and 17 other languages.',
      );
  });

  test('it has a descriptive title on the catalog', async function (assert) {
    await visit('/catalog');
    assert.strictEqual(getPageTitle(), 'Programming Challenges for Experienced Engineers | CodeCrafters');
  });
});
