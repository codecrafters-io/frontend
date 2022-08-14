import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | course-page/step-list/course-stage-item', function (hooks) {
  setupRenderingTest(hooks);

  test('opens all links in new tab', async function (assert) {
    const store = this.owner.lookup('service:store');

    const language = store.createRecord('language');

    const course = store.createRecord('course', {
      supportedLanguages: [language],
    });

    const courseStage = store.createRecord('course-stage', {
      course: course,
      descriptionMarkdownTemplate: `[link1](https://link1.com), [link2](https://link2.com)`,
    });

    const repository = store.createRecord('repository', { course: course });

    this.set('courseStage', courseStage);
    this.set('repository', repository);
    this.set('noop', () => {});

    await render(hbs`
      <CoursePage::StepList::CourseStageItem
        @courseStage={{this.courseStage}}
        @repository={{this.repository}}
        @onViewNextStageButtonClick={{this.noop}}
        @onViewSolutionButtonClick={{this.noop}}
        @onViewSourceWalkthroughButtonClick={{this.noop}} />
    `);

    assert.strictEqual(this.element.querySelectorAll('a').length, 2);
    assert.strictEqual(this.element.querySelectorAll('a[target="_blank"]').length, 2);
  });
});
