import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
import type { AutofixHint } from 'codecrafters-frontend/models/autofix-request';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    autofixRequest: AutofixRequestModel;
  };
}

export default class AutofixRequestCard extends Component<Signature> {
  transition = fade;

  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @tracked solutionIsBlurred = true;
  @tracked expandedHintIndex: number | null = null;

  get dummyHint(): AutofixHint {
    return {
      slug: 'dummy',
      title_markdown: 'Generating hint...',
      description_markdown: "We're analyzing your codebase to generate hints.",
    };
  }

  @action
  handleHideSolutionButtonClick() {
    this.solutionIsBlurred = true;
  }

  @action
  handleHintCollapse(): void {
    this.expandedHintIndex = null;
  }

  @action
  handleHintExpand(hintIndex: number): void {
    this.expandedHintIndex = hintIndex;
    this.solutionIsBlurred = true;
  }

  @action
  handleRevealSolutionButtonClick() {
    this.analyticsEventTracker.track('revealed_autofix_diff', { autofix_request_id: this.args.autofixRequest.id });
    this.solutionIsBlurred = false;
    this.expandedHintIndex = null;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard': typeof AutofixRequestCard;
  }
}
