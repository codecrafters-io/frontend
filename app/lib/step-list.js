import { tracked } from '@glimmer/tracking';

export class SetupItem {
  type = 'SetupItem';

  get identifier() {
    return 'setup';
  }

  get shouldAdvanceToNextItemAutomatically() {
    return true;
  }
}

export class CourseStageItem {
  @tracked courseStage;
  @tracked repository;
  @tracked featureFlags;

  type = 'CourseStageItem';

  constructor(repository, courseStage, featureFlags) {
    this.repository = repository;
    this.courseStage = courseStage;
    this.featureFlags = featureFlags;
  }

  get badgeAwards() {
    return this.repository.user.badgeAwards.filter((badgeAward) => badgeAward.submission.courseStage.id === this.courseStage.id);
  }

  get identifier() {
    return this.courseStage.id;
  }

  get shouldAdvanceToNextItemAutomatically() {
    if (this.featureFlags.canSeeBadges && this.courseStage.isFirst && this.badgeAwards.length > 0) {
      return false;
    }

    if (this.featureFlags.canSeeStageCompletionVideos && this.courseStage.hasCompletionVideo) {
      return false;
    }

    return !this.shouldShowFeedbackPromptIfStageIsComplete;
  }

  get shouldShowFeedbackPromptIfStageIsComplete() {
    return !this.courseStage.isFirst; // First stage is just uncommenting, not much to give feedback on
  }
}

export class CourseCompletedItem {
  type = 'CourseCompletedItem';

  get identifier() {
    return 'completed';
  }

  get shouldAdvanceToNextItemAutomatically() {
    return false;
  }
}
