import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: StepDefinition;
    course: CourseModel;
    currentStep: StepDefinition;
    nextStep: StepDefinition | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepListDefinition;
  };
}

export default class MainSectionComponent extends Component<Signature> {
  get currentStepAsCourseStageStep(): CourseStageStep {
    return this.args.currentStep as CourseStageStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::MainSection': typeof MainSectionComponent;
  }
}
