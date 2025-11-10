import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type Logstream from 'codecrafters-frontend/utils/logstream';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

export default class AutofixResult extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @tracked shouldShowFullLog = false;
  @tracked logstreamContent: string | null = null;
  @tracked diffIsBlurred = true;

  @action
  handleLogstreamDidUpdate(logstream: Logstream): void {
    this.logstreamContent = logstream.content;

    // TODO: See if we're doing this too often?
    // Ensure we also reload the autofix request to see whether the status has changed
    this.args.autofixRequest.reload();
  }

  @action
  toggleBlur() {
    if (this.diffIsBlurred) {
      this.analyticsEventTracker.track('revealed_autofix_request_diff', { autofix_request_id: this.args.autofixRequest.id });
    }

    this.diffIsBlurred = !this.diffIsBlurred;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixSection::AutofixResult': typeof AutofixResult;
  }
}
