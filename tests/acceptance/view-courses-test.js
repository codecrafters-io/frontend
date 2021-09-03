import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { visit } from '@ember/test-helpers';

module('Acceptance | view-courses', function (hooks) {
  setupApplicationTest(hooks);

  test('it renders', async function (assert) {
    await visit('/courses');
    await this.pauseTest();
  });
});
