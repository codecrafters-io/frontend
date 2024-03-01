import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import CourseStageModel from 'codecrafters-frontend/models/course-stage';
import LanguageModel from 'codecrafters-frontend/models/language';
import Mustache from 'mustache';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
    courseStage: CourseStageModel;
    repository: RepositoryModel;
  };
}

export default class YourTaskCardComponent extends Component<Signature> {
  @service declare coursePageState: CoursePageStateService;
  @service declare store: Store;
  @tracked manualFeedbackFlowIsActive = false;

  get automaticFeedbackFlowIsActive() {
    return (
      this.shouldShowFeedbackPromptIfStageIsComplete &&
      this.args.repository.highestCompletedStage === this.args.courseStage &&
      !this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage)
    );
  }

  get instructionsMarkdown() {
    const variables: Record<string, unknown> = {};

    this.store.peekAll('language').forEach((language) => {
      variables[`lang_is_${(language as LanguageModel).slug}`] = this.args.repository.language === language;
    });

    return Mustache.render(this.args.courseStage.descriptionMarkdownTemplate, variables);
  }

  get shouldShowFeedbackPromptIfStageIsComplete() {
    return !this.args.courseStage.isFirst;
  }

  @action
  handleFeedbackActionButtonClicked() {
    this.manualFeedbackFlowIsActive = !this.manualFeedbackFlowIsActive;
  }

  @action
  handleFeedbackPromptClosed() {
    this.manualFeedbackFlowIsActive = false;
  }

  @action
  handleFeedbackSubmitted() {
    if (this.manualFeedbackFlowIsActive) {
      this.manualFeedbackFlowIsActive = false;
    } else {
      // this.args.onViewNextStageButtonClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::CourseStageStep::YourTaskCard': typeof YourTaskCardComponent;
  }
}
