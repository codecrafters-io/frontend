import { tracked } from '@glimmer/tracking';
import { isToday, isYesterday } from 'date-fns';
import { formatDistanceStrictWithOptions } from 'date-fns/fp';
import type ProgressIndicator from 'codecrafters-frontend/utils/course-page-step-list/progress-indicator';
import Step from 'codecrafters-frontend/utils/course-page-step-list/step';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RepositoryStageListItemModel from 'codecrafters-frontend/models/repository-stage-list-item';

export default class CourseStageStep extends Step {
  @tracked stageListItem;
  @tracked repository;

  constructor(repository: RepositoryModel, stageListItem: RepositoryStageListItemModel) {
    super();

    this.repository = repository;
    this.stageListItem = stageListItem;
  }

  get breadcrumbs(): string[] {
    if (this.courseStage.isExtensionStage) {
      return [
        this.courseStage.primaryExtension!.name,
        `Stage ${this.courseStage.positionWithinExtension}/${this.courseStage.primaryExtension!.stages.length}`,
      ];
    } else {
      return [`Stage ${this.courseStage.positionWithinCourse}/${this.courseStage.course.baseStages.length}`];
    }
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

  get completionNoticeMessage() {
    if (this.status !== 'complete') {
      return null;
    }

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

  get courseStage() {
    return this.stageListItem.stage;
  }

  get firstStageTestFailureExplanationMarkdown() {
    return `
This failure is expected!

Check the [Tutorial](#first-stage-instructions-card) section for instructions.`.trim();
  }

  get lastFailedSubmission() {
    if (this.repository.lastSubmissionHasFailureStatus) {
      return this.repository.lastSubmission;
    } else {
      return null;
    }
  }

  get lastFailedSubmissionCreatedAt() {
    return this.lastFailedSubmission ? this.lastFailedSubmission.createdAt : null;
  }

  get lastFailedSubmissionWasWithinLast10Minutes() {
    return this.lastFailedSubmissionCreatedAt && new Date().getTime() - this.lastFailedSubmissionCreatedAt.getTime() <= 600 * 1000; // in last 10 minutes
  }

  get progressIndicator(): ProgressIndicator | null {
    if (this.testsStatus === 'evaluating') {
      return {
        dotColor: 'yellow',
        dotType: 'blinking',
        text: 'Running tests...',
      };
    } else if (this.status === 'complete') {
      return {
        dotType: 'none',
        text: this.completionNoticeMessage!,
      };
    } else if (this.testsStatus === 'failed') {
      return {
        dotColor: 'red',
        dotType: 'static',
        text: this.testFailureMessage,
        explanationMarkdown: this.courseStage.isFirst ? this.firstStageTestFailureExplanationMarkdown : undefined,
      };
    } else if (this.testsStatus === 'passed') {
      return {
        dotColor: 'green',
        dotType: 'static',
        text: 'Tests passed!',
      };
    } else if (this.status === 'in_progress') {
      return {
        dotColor: 'gray',
        dotType: 'blinking',
        text: this.courseStage.isFirst ? 'Listening for a git push...' : 'Ready to run tests...',
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

  get routeParams() {
    return {
      route: 'course.stage.instructions',
      models: [this.courseStage.course.slug, this.courseStage.identifierForURL],
    };
  }

  // TODO[Extensions]: Can we avoid using CourseStage#position?
  get shortTitle(): string {
    if (this.courseStage.isExtensionStage) {
      return `${this.courseStage.name} (${this.courseStage.primaryExtension!.name})`;
    } else {
      return this.courseStage.name;
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

  get testFailureMessage(): string {
    return 'Tests failed.';
  }

  get testsStatus(): 'evaluating' | 'failed' | 'passed' | 'error_or_not_run' {
    if (this.repository.lastSubmissionIsEvaluating && this.repository.lastSubmission!.courseStage === this.courseStage) {
      return 'evaluating';
    }

    if (this.repository.lastSubmissionHasFailureStatus && this.repository.lastSubmission!.courseStage === this.courseStage) {
      return 'failed';
    }

    if (this.repository.lastSubmissionHasSuccessStatus && this.repository.lastSubmission!.courseStage === this.courseStage) {
      return 'passed';
    }

    return 'error_or_not_run';
  }

  get title() {
    return this.courseStage.name;
  }

  get type(): 'CourseStageStep' {
    return 'CourseStageStep';
  }
}
