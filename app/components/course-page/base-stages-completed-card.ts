import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import type CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class BaseStagesCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @service declare coursePageState: CoursePageStateService;
  @service declare router: RouterService;

  @tracked configureExtensionsModalIsOpen = false;

  @action
  handleConfigureExtensionsButtonClick() {
    this.configureExtensionsModalIsOpen = true;
  }

  @action
  async handleConfigureExtensionsModalClose() {
    this.configureExtensionsModalIsOpen = false;

    // If the user has chosen extensions, transition to the first next stage
    if (this.coursePageState.nextStep && this.coursePageState.nextStep !== this.coursePageState.currentStep) {
      this.router.transitionTo(this.coursePageState.nextStep.routeParams.route, this.coursePageState.nextStep.routeParams.models);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::BaseStagesCompletedCard': typeof BaseStagesCompletedCardComponent;
  }
}
