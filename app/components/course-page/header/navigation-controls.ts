import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/lib/course-page-step-list';
import { inject as service } from '@ember/service';
import CourseStageStep from 'codecrafters-frontend/lib/course-page-step-list/course-stage-step';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    activeStep: Step;
    course: CourseModel;
    currentStep: Step;
    nextStep: Step | null;
    onMobileSidebarButtonClick: () => void;
    stepList: StepList;
  };
};

export default class NavigationControlsComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;

  get currentStepAsCourseStageStep() {
    return this.args.currentStep as CourseStageStep;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::NavigationControls': typeof NavigationControlsComponent;
  }
}
