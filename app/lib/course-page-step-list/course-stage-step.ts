import { tracked } from '@glimmer/tracking';
import { isToday, isYesterday } from 'date-fns';
import moment from 'moment';
import ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';

export default class CourseStageStep extends Step {
  @tracked courseStage;
  @tracked repository;

  constructor(repository: unknown, courseStage: unknown) {
    super();

    this.repository = repository;
    this.courseStage = courseStage;
  }

  get completedAt(): Date | null {
    // @ts-ignore
    return this.repository.stageCompletedAt(this.courseStage);
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
        // @ts-ignore
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
      return `You completed this stage ${moment(this.completedAt).fromNow()}.`;
    } else {
      return `You've completed this stage.`;
    }
  }

  get status() {
    // @ts-ignore
    if (this.repository.stageIsComplete(this.courseStage)) {
      return 'complete';
      // @ts-ignore
    } else if (this.repository.activeStage === this.courseStage) {
      return 'in_progress';
    } else {
      return 'locked';
    }
  }

  get lastFailedSubmissionWasWithinLast10Minutes() {
    // @ts-ignore
    return this.lastFailedSubmissionCreatedAt && new Date() - this.lastFailedSubmissionCreatedAt <= 600 * 1000; // in last 10 minutes
  }

  get lastFailedSubmissionCreatedAt() {
    return this.lastFailedSubmission ? this.lastFailedSubmission.createdAt : null;
  }

  get lastFailedSubmission() {
    // @ts-ignore
    if (this.repository.lastSubmissionHasFailureStatus) {
      // @ts-ignore
      return this.repository.lastSubmission;
    } else {
      return null;
    }
  }

  get testFailureMessage(): string {
    if (this.lastFailedSubmissionWasWithinLast10Minutes) {
      return 'Tests failed.';
    } else if (this.lastFailedSubmissionCreatedAt) {
      return `Last attempt ${moment(this.lastFailedSubmissionCreatedAt).fromNow()}. Try again?`;
    } else {
      return 'Last attempt failed. Try again?';
    }
  }

  get testsStatus(): 'evaluating' | 'failed' | 'passed_or_not_run' {
    // @ts-ignore
    if (this.repository.lastSubmissionIsEvaluating && this.repository.lastSubmission.courseStage === this.courseStage) {
      return 'evaluating';
    }

    // @ts-ignore
    if (this.repository.lastSubmissionHasFailureStatus && this.repository.lastSubmission.courseStage === this.courseStage) {
      return 'failed';
    }

    return 'passed_or_not_run';
  }

  get routeParams() {
    return {
      route: 'course.stage.instructions',
      // @ts-ignore
      models: [this.courseStage.course.slug, this.courseStage.position],
    };
  }

  get title() {
    // @ts-ignore
    return this.courseStage.name;
  }
}
