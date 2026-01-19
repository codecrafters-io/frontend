import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import type { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeRepository: RepositoryModel;
    activeStep: StepDefinition;
    course: CourseModel;
    currentStep: StepDefinition;
    nextStep: StepDefinition | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepListDefinition;
    track: string | undefined;
  };
}

export default class MainSection extends Component<Signature> {
  get currentStepAsCourseStageStep(): CourseStageStep {
    return this.args.currentStep as CourseStageStep;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::MainSection': typeof MainSection;
  }
}
