import { isToday, isYesterday } from 'date-fns';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseStageItemFooterComponent extends Component {
  @tracked logsAreExpanded = false;

  @service analyticsEventTracker;

  get completedAt() {
    return this.args.repository.stageCompletedAt(this.args.courseStage);
  }

  get completedAtWasToday() {
    return this.completedAt && isToday(this.completedAt, new Date());
  }

  get completedAtWasYesterday() {
    return this.completedAt && isYesterday(this.completedAt);
  }

  get debuggingArticleLink() {
    return 'https://docs.codecrafters.io/challenges/debug-test-failures';
  }

  get lastFailedSubmissionWasWithinLast10Minutes() {
    return this.lastFailedSubmissionCreatedAt && new Date() - this.lastFailedSubmissionCreatedAt <= 600 * 1000; // in last 10 minutes
  }

  get lastFailedSubmissionCreatedAt() {
    return this.lastFailedSubmission ? this.lastFailedSubmission.createdAt : null;
  }

  get lastFailedSubmission() {
    if (this.args.repository.lastSubmissionHasFailureStatus) {
      return this.args.repository.lastSubmission;
    } else {
      return null;
    }
  }

  handleLogsButtonClick() {
    this.logsAreExpanded = !this.logsAreExpanded;

    if (this.logsAreExpanded && this.lastFailedSubmission) {
      this.analyticsEventTracker.track('viewed_logs', {
        submussion_id: this.lastFailedSubmission.id,
      });
    }
  }
}
