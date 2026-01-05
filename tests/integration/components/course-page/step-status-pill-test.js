import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { module, test } from 'qunit';

module('Integration | Component | course-page/step-status-pill', function (hooks) {
  setupRenderingTest(hooks);

  test('it shows "Membership required" for paid stages that cannot be attempted', async function (assert) {
    this.set('step', {
      status: 'in_progress',
      type: 'CourseStageStep',
      courseStage: { isPaid: true },
      repository: {
        user: {
          canAttemptCourseStage() {
            return false;
          },
        },
      },
    });

    await render(hbs`<CoursePage::StepStatusPill @step={{this.step}} />`);

    assert.dom('[data-test-step-status-pill-membership-required]').hasText('Membership required');
  });

  test('it shows "In-progress" for paid stages that can be attempted', async function (assert) {
    this.set('step', {
      status: 'in_progress',
      type: 'CourseStageStep',
      courseStage: { isPaid: true },
      repository: {
        user: {
          canAttemptCourseStage() {
            return true;
          },
        },
      },
    });

    await render(hbs`<CoursePage::StepStatusPill @step={{this.step}} />`);

    assert.dom('[data-test-step-status-pill-in-progress]').hasText('In-progress');
  });
});
