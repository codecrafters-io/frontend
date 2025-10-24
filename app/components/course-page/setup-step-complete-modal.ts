import Component from '@glimmer/component';
import type SetupStep from 'codecrafters-frontend/utils/course-page-step-list/setup-step';
import { tracked } from '@glimmer/tracking';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose: () => void;
    step: SetupStep;
  };
}

type Screen =
  | 'start-workflow-tutorial' // When a user has a pending "repository_workflow_tutorial" feature suggesion
  | 'workflow-tutorial-step-1' // Step 1 of the workflow tutorial
  | 'workflow-tutorial-step-2' // Step 2 of the workflow tutorial
  | 'workflow-tutorial-completed' // When the user just completed the workflow tutorial
  | 'step-previously-completed'; // When the user has already completed the step previously

export default class SetupStepCompleteModalComponent extends Component<Signature> {
  transition = fade;

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked currentScreen: Screen = 'start-workflow-tutorial';

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    // We decide which screen to show based on `FeatureSuggestion` models.
    if (this.authenticator.currentUser!.pendingRepositoryWorkflowTutorialFeatureSuggestion) {
      this.currentScreen = 'start-workflow-tutorial';
    } else {
      this.currentScreen = 'step-previously-completed';
    }
  }

  @action
  async handleBackToReviewButtonClick() {
    this.currentScreen = 'workflow-tutorial-step-1';
  }

  @action
  async handleNextButtonClick() {
    if (this.currentScreen == 'start-workflow-tutorial') {
      this.currentScreen = 'workflow-tutorial-step-1';
    } else if (this.currentScreen == 'workflow-tutorial-step-1') {
      this.currentScreen = 'workflow-tutorial-step-2';
    } else if (this.currentScreen == 'workflow-tutorial-step-2') {
      this.currentScreen = 'workflow-tutorial-completed';

      if (this.authenticator.currentUser!.pendingRepositoryWorkflowTutorialFeatureSuggestion) {
        await this.authenticator.currentUser!.pendingRepositoryWorkflowTutorialFeatureSuggestion.dismiss();
      }
    } else if (this.currentScreen == 'workflow-tutorial-completed') {
      this.router.transitionTo('course.stage.instructions', this.args.step.repository.course.firstStage!.slug);
    } else {
      throw new Error(`Invalid screen for next button click: ${this.currentScreen}`);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStepCompleteModal': typeof SetupStepCompleteModalComponent;
  }
}
