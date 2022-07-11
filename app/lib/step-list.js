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
    if (this.courseStage.isLast) {
      return true; // Let's take the user to their congratulations card as quickly as possible, they can come back to look at solutions if needed.
    } else {
      return !this.shouldShowPostCompletionPrompt;
    }
  }

  get shouldShowPostCompletionPrompt() {
    return this.solutionIsAvailableInUserLanguage || this.sourceWalkthroughIsAvailable;
  }

  get solutionIsAvailableInUserLanguage() {
    return this.courseStage.hasSolutionForLanguage(this.repository.language);
  }

  get sourceWalkthroughIsAvailable() {
    return this.courseStage.hasSourceWalkthrough;
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
