import { module, test } from 'qunit';
import { setupTest } from 'codecrafters-frontend/tests/helpers';

module('Unit | Model | course', function (hooks) {
  setupTest(hooks);

  function createCourseWithLanguages(store, attributes, languages) {
    const course = store.createRecord('course', { name: 'Build your own Redis', ...attributes });

    for (const [name, releaseStatus] of languages) {
      const language = store.createRecord('language', { name, slug: name.toLowerCase() });
      store.createRecord('course-language-configuration', { course, language, releaseStatus });
    }

    return course;
  }

  test('overview description names the most used languages first', function (assert) {
    const store = this.owner.lookup('service:store');

    const course = createCourseWithLanguages(store, { shortDescription: 'Learn about TCP servers and more.' }, [
      ['C', 'beta'],
      ['Python', 'live'],
      ['Go', 'live'],
      ['Rust', 'live'],
    ]);

    assert.strictEqual(
      course.overviewPageMetaDescription,
      'Build your own Redis from scratch. Learn about TCP servers and more. Available in Rust, Go, Python, and 1 other language.',
    );
  });

  test('overview description lists every language when there are three or fewer', function (assert) {
    const store = this.owner.lookup('service:store');

    const course = createCourseWithLanguages(store, { shortDescription: 'Learn about TCP servers and more' }, [
      ['Python', 'live'],
      ['Go', 'beta'],
      ['Zig', 'alpha'],
    ]);

    assert.strictEqual(
      course.overviewPageMetaDescription,
      'Build your own Redis from scratch. Learn about TCP servers and more. Available in Go and Python.',
    );
  });

  test('overview description skips the parts a course has no data for', function (assert) {
    const store = this.owner.lookup('service:store');
    const course = createCourseWithLanguages(store, { shortDescription: '' }, [['Go', 'alpha']]);

    assert.strictEqual(course.overviewPageMetaDescription, 'Build your own Redis from scratch.');
  });
});
