import Component from '@glimmer/component';
import { StepDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: StepDefinition;
    barIsExpanded: boolean;
    onCollapseButtonClick: () => void;
    onExpandButtonClick: () => void;
  };
}

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
