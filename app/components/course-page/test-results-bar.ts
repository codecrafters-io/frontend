import { action } from '@ember/object';
import { next } from '@ember/runloop';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
  };
};

export default class TestResultsBarComponent extends Component<Signature> {
  @tracked isExpanded = false;

  get activeStepAsCourseStageStep() {
    return this.args.activeStep as CourseStageStep;
  }

  get isCollapsed() {
    return !this.isExpanded;
  }

  @action
  handleCollapseButtonClick() {
    // Avoid conflict with handleCollapsedBarClick
    next(() => {
      this.isExpanded = false;
    });
  }

  @action
  handleCollapsedBarClick() {
    if (this.isCollapsed) {
      this.isExpanded = true;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
