import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RouterService from '@ember/routing/router-service';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

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

export default class NavigationControls extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;

  get activeDiscountForYearlyPlan(): PromotionalDiscountModel | null {
    return this.currentUser?.activeDiscountForYearlyPlan || null;
  }

  get currentStepAsCourseStageStep() {
    return this.args.currentStep as CourseStageStep;
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::NavigationControls': typeof NavigationControls;
  }
}
