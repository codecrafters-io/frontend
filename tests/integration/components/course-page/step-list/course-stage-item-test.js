import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Integration | Component | course-page/step-list/course-stage-item', function (hooks) {
  setupRenderingTest(hooks);
  setupMirage(hooks);

  test('opens all links in new tab', async function (assert) {
    const store = this.owner.lookup('service:store');
    const mirageUser = this.server.create('user', { createdAt: new Date(), id: 'dummy', username: 'test' });
    const user = store.createRecord('user', { createdAt: new Date(), id: 'dummy', username: 'test' });

    signIn(this.owner, this.server, mirageUser);

    const language = store.createRecord('language');
    const course = store.createRecord('course');

    store.createRecord('course-language-configuration', { course: course, language: language });

    const courseStage = store.createRecord('course-stage', {
      course: course,
      descriptionMarkdownTemplate: `[link1](https://link1.com), [link2](https://link2.com)`,
    });

    const repository = store.createRecord('repository', { course: course, user: user });

    this.set('courseStage', courseStage);
    this.set('repository', repository);
    this.set('noop', () => {});

    await render(hbs`<CoursePage::StepList::CourseStageItem
  @courseStage={{this.courseStage}}
  @repository={{this.repository}}
  @onViewNextStageButtonClick={{this.noop}}
  @onViewCommentsButtonClick={{this.noop}}
  @onViewSolutionButtonClick={{this.noop}}
  @onViewSourceWalkthroughButtonClick={{this.noop}}
/>`);

    assert.strictEqual(this.element.querySelectorAll('a').length, 2); // includes first stage link
    assert.strictEqual(this.element.querySelectorAll('a[target="_blank"]').length, 2);
  });
});
