import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';
import type FeatureFlagsService from 'codecrafters-frontend/services/feature-flags';
import type RouterService from '@ember/routing/router-service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class ActionButtonListComponent extends Component<Signature> {
  @service declare featureFlags: FeatureFlagsService;
  @service declare router: RouterService;

  transition = fade;

  get anyButtonIsVisible() {
    return this.shouldShowCodeExamplesButton || this.shouldShowViewTestCasesButton || this.shouldShowViewScreencastsButton;
  }

  get shouldShowCodeExamplesButton() {
    // TODO: Remove. Temporary measure for private course
    return !this.args.courseStage.isFirst && this.args.courseStage.slug !== 'gleam-chess-bot';
  }

  get shouldShowViewScreencastsButton() {
    if (this.args.courseStage.isFirst) {
      return false; // Don't expose user to too many features at once
    }

    return this.args.courseStage.hasScreencasts;
  }

  get shouldShowViewTestCasesButton() {
    if (this.args.courseStage.isFirst || this.args.courseStage.isSecond) {
      return false; // Don't expose user to too many features at once
    }

    return this.args.courseStage.testerSourceCodeUrl;
  }

  @action
  handleViewCodeExamplesButtonClicked() {
    this.router.transitionTo('course.stage.code-examples');
  }

  @action
  handleViewScreencastsButtonClicked() {
    this.router.transitionTo('course.stage.screencasts');
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank')!.focus();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard::ActionButtonList': typeof ActionButtonListComponent;
  }
}
