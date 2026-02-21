import Service from '@ember/service';
import { click, render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'codecrafters-frontend/tests/helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';

class AnalyticsEventTrackerStub extends Service {
  trackedEvents = [];

  track(eventName, eventProperties) {
    this.trackedEvents.push({ eventName, eventProperties });
  }
}

class CoursePageStateStub extends Service {
  activeStep = { routeParams: { route: 'index', models: [] }, type: 'CourseStageStep' };
  currentStep = { type: 'CourseStageStep' };
  currentStepAsCourseStageStep = { stageListItem: { stage: { isFirst: false } } };
  nextStep = null;
  stepListAsStepListDefinition = {
    repository: { id: 'repository-1', course: { name: 'Build your own Redis', slug: 'redis' }, language: { name: 'Go' } },
  };
}

module('Integration | Component | course-page/current-step-complete-pill', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:analytics-event-tracker', AnalyticsEventTrackerStub);
    this.owner.register('service:course-page-state', CoursePageStateStub);

    this.modalBackdropContainerElement = document.createElement('div');
    this.modalBackdropContainerElement.id = 'modal-backdrop-container';
    document.body.appendChild(this.modalBackdropContainerElement);
  });

  hooks.afterEach(function () {
    this.modalBackdropContainerElement.remove();
    document.body.classList.remove('overflow-hidden');
  });

  test('button copy changes based on the resolved target step', async function (assert) {
    const coursePageState = this.owner.lookup('service:course-page-state');

    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-next-or-active-step-button]').includesText('View current stage');

    coursePageState.nextStep = { routeParams: { route: 'index', models: [] }, type: 'BaseStagesCompletedStep' };
    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-next-or-active-step-button]').includesText('View next step');

    coursePageState.activeStep = { routeParams: { route: 'index', models: [] }, type: 'IntroductionStep' };
    coursePageState.nextStep = { routeParams: { route: 'index', models: [] }, type: 'CourseStageStep' };
    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-next-or-active-step-button]').includesText('View current step');
  });

  test('share progress button visibility and actions are correct', async function (assert) {
    const analyticsEventTracker = this.owner.lookup('service:analytics-event-tracker');
    const coursePageState = this.owner.lookup('service:course-page-state');

    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-share-progress-button]').exists('share progress button is visible for non-first stage');

    await click('[data-test-share-progress-button]');
    assert.ok(document.querySelector('[data-test-share-progress-modal]'), 'share progress modal is open after button click');
    assert.deepEqual(analyticsEventTracker.trackedEvents, [
      {
        eventName: 'initiated_share_progress_flow',
        eventProperties: { repository_id: 'repository-1' },
      },
    ]);

    const closeButtonElement = document.querySelector('[data-test-close-modal-button]');
    assert.ok(closeButtonElement, 'close button is rendered');
    closeButtonElement.click();
    await settled();
    assert.notOk(document.querySelector('[data-test-share-progress-modal]'), 'share progress modal is closed');

    coursePageState.currentStepAsCourseStageStep = { stageListItem: { stage: { isFirst: true } } };
    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-share-progress-button]').doesNotExist('share progress button is hidden for first stage');

    coursePageState.currentStep = { type: 'SetupStep' };
    await render(hbs`<CoursePage::CurrentStepCompletePill />`);
    assert.dom('[data-test-share-progress-button]').doesNotExist('share progress button is hidden for non-stage steps');
  });
});
