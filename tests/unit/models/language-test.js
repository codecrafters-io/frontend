import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Model | language', function (hooks) {
  setupTest(hooks);

  function createCourse(store, language, shortName, { releaseStatus = 'live', visibility = 'public', configurationReleaseStatus = 'live' } = {}) {
    const course = store.createRecord('course', {
      name: `Build your own ${shortName}`,
      releaseStatus,
      shortName,
      slug: shortName.toLowerCase().replace(' ', '-'),
      visibility,
    });

    store.createRecord('course-language-configuration', { course, language, releaseStatus: configurationReleaseStatus });

    return course;
  }

  test('track title and description name the best-known courses first', function (assert) {
    const store = this.owner.lookup('service:store');
    const go = store.createRecord('language', { name: 'Go', slug: 'go' });

    createCourse(store, go, 'Shell');
    createCourse(store, go, 'SQLite');
    createCourse(store, go, 'grep', { releaseStatus: 'beta' });
    createCourse(store, go, 'Git');
    createCourse(store, go, 'Redis');

    assert.strictEqual(go.trackPageTitle, 'Go Projects: Build Redis, Git, SQLite & More');

    assert.strictEqual(
      go.trackMetaDescription,
      'Master Go by building Redis, Git, SQLite, and 2 more real-world projects from scratch. Advanced, test-driven challenges for experienced engineers.',
    );
  });

  test('track title and description name every course when there are three or fewer', function (assert) {
    const store = this.owner.lookup('service:store');
    const dart = store.createRecord('language', { name: 'Dart', slug: 'dart' });

    createCourse(store, dart, 'HTTP server');
    createCourse(store, dart, 'Redis');

    assert.strictEqual(dart.trackPageTitle, 'Dart Projects: Build Redis & HTTP server');

    assert.strictEqual(
      dart.trackMetaDescription,
      'Master Dart by building Redis and HTTP server from scratch. Advanced, test-driven challenges for experienced engineers.',
    );
  });

  test('track title and description leave out courses the track page hides', function (assert) {
    const store = this.owner.lookup('service:store');
    const nim = store.createRecord('language', { name: 'Nim', slug: 'nim' });

    createCourse(store, nim, 'Redis', { releaseStatus: 'alpha' });
    createCourse(store, nim, 'Docker', { releaseStatus: 'deprecated' });
    createCourse(store, nim, 'Git', { visibility: 'private' });
    createCourse(store, nim, 'SQLite', { configurationReleaseStatus: 'alpha' });

    assert.strictEqual(nim.trackPageTitle, 'Nim Projects');
    assert.strictEqual(nim.trackMetaDescription, 'Master Nim with advanced, test-driven challenges for experienced engineers.');
  });
});
