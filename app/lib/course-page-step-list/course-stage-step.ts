import { tracked } from '@glimmer/tracking';
import { isToday, isYesterday } from 'date-fns';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export default class CourseStageStep extends Step {
  @tracked stageListItem;
  @tracked repository;

  constructor(repository: TemporaryRepositoryModel, stageListItem: RepositoryStageListItemModel, positionInGroup: number, globalPosition: number) {
    super(positionInGroup, globalPosition);

    this.repository = repository;
    this.stageListItem = stageListItem;
  }

  get courseStage() {
    return this.stageListItem.stage;
  }

  get completedAt(): Date | null {
    return this.stageListItem.completedAt;
  }

  get completedAtWasToday() {
    return this.completedAt && isToday(this.completedAt);
  }

  get completedAtWasYesterday() {
    return this.completedAt && isYesterday(this.completedAt);
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.testsStatus === 'evaluating') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Running tests...',
      };
    } else if (this.testsStatus === 'failed') {
      return {
        dotColor: 'red',
        dotType: 'static',
        text: this.testFailureMessage,
      };
    } else if (this.status === 'complete') {
      return {
        dotColor: 'green',
        dotType: 'static',
        text: this.stageCompletedMessage,
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'gray',
        dotType: 'blinking',
        text: 'Listening for a git push...',
      };
    } else if (this.status === 'locked') {
      return {
        dotType: 'none',
        text: this.courseStage.isFirst
          ? 'Complete repository setup to gain access to this stage.'
          : 'Complete previous stages to gain access to this stage.',
      };
    } else {
      return null;
    }
  }

  get stageCompletedMessage() {
    if (this.completedAtWasToday) {
      return 'You completed this stage today.';
    } else if (this.completedAtWasYesterday) {
      return 'You completed this stage yesterday.';
    } else if (this.completedAt) {
      return `You completed this stage ${formatDistanceStrictWithOptions({ addSuffix: true }, new Date(), this.completedAt || new Date())}.`;
    } else {
      return `You've completed this stage.`;
    }
  }

  get status() {
    // TODO: Might need to prioritize "in_progress" when allowing users to change currentStage
    if (this.completedAt) {
      return 'complete';
    } else if (this.repository.currentStage === this.courseStage) {
      return 'in_progress';
    } else {
      return 'locked';
    }
  }

  get lastFailedSubmissionWasWithinLast10Minutes() {
    return this.lastFailedSubmissionCreatedAt && new Date().getTime() - this.lastFailedSubmissionCreatedAt.getTime() <= 600 * 1000; // in last 10 minutes
  }

  get lastFailedSubmissionCreatedAt() {
    return this.lastFailedSubmission ? this.lastFailedSubmission.createdAt : null;
  }

  get lastFailedSubmission() {
    if (this.repository.lastSubmissionHasFailureStatus) {
      return this.repository.lastSubmission;
    } else {
      return null;
    }
  }

  get testFailureMessage(): string {
    if (this.lastFailedSubmissionWasWithinLast10Minutes) {
      return 'Tests failed.';
    } else if (this.lastFailedSubmissionCreatedAt) {
      return `Last attempt ${formatDistanceStrictWithOptions(
        { addSuffix: true },
        new Date(),
        this.lastFailedSubmissionCreatedAt || new Date(),
      )}. Try again?`;
    } else {
      return 'Last attempt failed. Try again?';
    }
  }

  get testsStatus(): 'evaluating' | 'failed' | 'passed_or_not_run' {
    if (this.repository.lastSubmissionIsEvaluating && this.repository.lastSubmission!.courseStage === this.courseStage) {
      return 'evaluating';
    }

    if (this.repository.lastSubmissionHasFailureStatus && this.repository.lastSubmission!.courseStage === this.courseStage) {
      return 'failed';
    }

    return 'passed_or_not_run';
  }

  get routeParams() {
    return {
      route: 'course.stage.instructions',
      models: [this.courseStage.course.slug, this.courseStage.identifierForURL],
    };
  }

  // TODO[Extensions]: Can we avoid using CourseStage#position?
  get shortTitle(): string {
    return `Stage ${this.courseStage.position}`;
  }

  get title() {
    return this.courseStage.name;
  }

  get type(): 'CourseStageStep' {
    return 'CourseStageStep';
  }
}
