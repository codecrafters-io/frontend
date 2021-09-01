import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module(
  'Integration | Component | course-page-header/repositories-dropdown',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.set('myAction', function(val) { ... });

      await render(hbs`<CoursePageHeader::RepositoriesDropdown />`);

      assert.dom(this.element).hasText('');

      // Template block usage:
      await render(hbs`
      <CoursePageHeader::RepositoriesDropdown>
        template block text
      </CoursePageHeader::RepositoriesDropdown>
    `);

      assert.dom(this.element).hasText('template block text');
    });
  }
);
