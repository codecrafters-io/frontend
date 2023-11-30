import Component from '@glimmer/component';
import { Step } from 'codecrafters-frontend/lib/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    barIsExpanded: boolean;
  };
};

export default class BottomSectionComponent extends Component<Signature> {
  get activeStepAsCourseStageStep() {
    return this.args.activeStep as CourseStageStep;
  }

  get barIsCollapsed() {
    return !this.args.barIsExpanded;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::BottomSection': typeof BottomSectionComponent;
  }
}
