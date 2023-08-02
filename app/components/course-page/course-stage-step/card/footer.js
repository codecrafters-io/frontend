import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class YourTaskCardFooterComponent extends Component {
  @service analyticsEventTracker;
  @service coursePageState;

  @tracked logsAreExpanded = false;

  get debuggingArticleLink() {
    return 'https://docs.codecrafters.io/challenges/debug-test-failures';
  }

  get lastFailedSubmission() {
    if (this.args.repository.lastSubmissionHasFailureStatus && this.args.repository.lastSubmission.courseStage === this.args.courseStage) {
      return this.args.repository.lastSubmission;
    } else {
      return null;
    }
  }

  @action
  handleLogsButtonClick() {
    this.logsAreExpanded = !this.logsAreExpanded;

    if (this.logsAreExpanded && this.lastFailedSubmission) {
      this.analyticsEventTracker.track('viewed_logs', {
        submission_id: this.lastFailedSubmission.id,
      });
    }
  }
}
