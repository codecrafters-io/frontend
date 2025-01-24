import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RouterService from '@ember/routing/router-service';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepList } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';

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

export default class NavigationControlsComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;

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
