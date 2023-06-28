import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { isToday, isYesterday } from 'date-fns';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import showdown from 'showdown';
import Mustache from 'mustache';

export default class CourseStageItemComponent extends Component {
  @service featureFlags;
  @service store;
  @service visibility;
  @tracked manualFeedbackFlowIsActive = false;
  transition = fade;

  get automaticFeedbackFlowIsActive() {
    return (
      this.args.shouldShowFeedbackPromptIfStageIsComplete &&
      this.args.repository.highestCompletedStage === this.args.courseStage &&
      !this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage)
    );
  }

  get badgeAwards() {
    return this.args.repository.user.badgeAwards.filter((badgeAward) => {
      return badgeAward.submission.repository.id === this.args.repository.id && badgeAward.submission.courseStage.id === this.args.courseStage.id;
    });
  }

  @action
  handleFeedbackActionButtonClicked() {
    this.manualFeedbackFlowIsActive = true;
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
      this.args.onViewNextStageButtonClick();
    }
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }

  @action
  handleViewSourceWalkthroughButtonClicked() {
    this.args.onViewSourceWalkthroughButtonClick();
  }

  get instructionsHTML() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.instructionsMarkdown));
  }

  get instructionsMarkdown() {
    const variables = {};

    this.store.peekAll('language').forEach((language) => {
      variables[`lang_is_${language.slug}`] = this.args.repository.language === language;
    });

    variables['readme_url'] = this.args.repository.readmeUrl || this.args.repository.defaultReadmeUrl;
    variables['starter_repo_url'] = this.args.repository.starterRepositoryUrl || this.args.repository.defaultStarterRepositoryUrl;

    return Mustache.render(this.args.courseStage.descriptionMarkdownTemplate, variables);
  }

  get isActiveStage() {
    return this.args.repository.activeStage === this.args.courseStage;
  }

  get shouldShowCLIUsageInstructions() {
    return this.args.courseStage.isSecond;
  }

  get shouldShowFirstStageHints() {
    return this.args.courseStage.isFirst && !this.statusIsComplete;
  }

  get shouldShowUpgradePrompt() {
    return this.isActiveStage && !this.statusIsComplete && !this.args.repository.user.canAttemptCourseStage(this.args.courseStage);
  }

  get shouldShowPublishToGitHubPrompt() {
    return !this.args.repository.githubRepositorySyncConfiguration && this.isActiveStage && !this.statusIsComplete && this.args.courseStage.isThird;
  }

  get status() {
    if (this.args.repository.lastSubmissionIsEvaluating && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'evaluating';
    }

    if (this.args.repository.stageIsComplete(this.args.courseStage)) {
      return 'complete';
    }

    if (this.args.repository.lastSubmissionHasFailureStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return 'failed';
    }

    if (this.args.repository.activeStage === this.args.courseStage) {
      return 'waiting';
    } else {
      return 'locked';
    }
  }

  get statusIsComplete() {
    return this.status === 'complete';
  }
}
