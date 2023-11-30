import Component from '@glimmer/component';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
  };
};

export default class TestResultsBarComponent extends Component<Signature> {
  get activeStepAsCourseStageStep() {
    return this.args.activeStep as CourseStageStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar': typeof TestResultsBarComponent;
  }
}
