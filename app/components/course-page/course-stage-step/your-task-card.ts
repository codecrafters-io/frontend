import Component from '@glimmer/component';
import CoursePageStateService from 'codecrafters-frontend/services/course-page-state';
import Mustache from 'mustache';
import Store from '@ember-data/store';
import showdown from 'showdown';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TemporaryCourseStageModel, TemporaryLanguageModel, TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';
import Prism from 'prismjs';

import 'prismjs';
import 'prismjs/components/prism-bash'; // This is the only one we use in instructions at the moment

interface Signature {
  Element: HTMLDivElement;

  Args: {
    title?: string;
    courseStage: TemporaryCourseStageModel;
    repository: TemporaryRepositoryModel;
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

  get instructionsHTML() {
    return new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.instructionsMarkdown);
  }

  get instructionsMarkdown() {
    const variables: Record<string, unknown> = {};

    this.store.peekAll('language').forEach((language) => {
      variables[`lang_is_${(language as TemporaryLanguageModel).slug}`] = this.args.repository.language === language;
    });

    return Mustache.render(this.args.courseStage.descriptionMarkdownTemplate, variables);
  }

  get shouldShowFeedbackPromptIfStageIsComplete() {
    return !this.args.courseStage.isFirst;
  }
  @action
  handleDidInsertInstructionsHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
  }

  @action
  handleDidUpdateInstructionsHTML(element: HTMLDivElement) {
    Prism.highlightAllUnder(element);
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
