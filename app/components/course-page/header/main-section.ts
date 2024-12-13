import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';
import type CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: CourseModel;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
  };
}

export default class MainSectionComponent extends Component<Signature> {
  get currentStepAsCourseStageStep(): CourseStageStep {
    return this.args.currentStep as CourseStageStep;
  }

  get shouldShowProgressIndicator(): boolean {
    // For complete steps, we have the "You've completed this step" banner
    if (this.args.currentStep.status === 'complete') {
      return false;
    }

    // For in-progress steps, users shouldn't be focused on this area anyway
    if (this.args.currentStep.status === 'in_progress') {
      return false;
    }

    // On the introduction step, let's not distract the user and instead focus on content
    if (this.args.currentStep.type === 'IntroductionStep') {
      return false;
    }

    return true;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::MainSection': typeof MainSectionComponent;
  }
}
