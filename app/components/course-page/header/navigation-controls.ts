import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import StepDefinition from 'codecrafters-frontend/utils/course-page-step-list/step';
import { StepListDefinition } from 'codecrafters-frontend/utils/course-page-step-list';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import CourseStageStep from 'codecrafters-frontend/utils/course-page-step-list/course-stage-step';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type PromotionalDiscountModel from 'codecrafters-frontend/models/promotional-discount';

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

  @action
  handleCloseButtonClick() {
    if (this.args.track) {
      this.router.transitionTo('track', this.args.track);
    } else if (this.args.activeRepository && this.args.activeRepository.firstSubmissionCreated) {
      this.router.transitionTo('track', this.args.activeRepository.language!.slug);
    } else {
      this.router.transitionTo('catalog');
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Header::NavigationControls': typeof NavigationControls;
  }
}
