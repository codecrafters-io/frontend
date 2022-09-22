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

  type = 'CourseStageItem';

  constructor(repository, courseStage) {
    this.repository = repository;
    this.courseStage = courseStage;
  }

  get identifier() {
    return this.courseStage.id;
  }

  get shouldAdvanceToNextItemAutomatically() {
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
