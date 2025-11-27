import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import type AutofixRequestModel from 'codecrafters-frontend/models/autofix-request';
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

  @tracked diffWasUnblurred = false;
  @tracked explanationWasUnblurred = false;

  get changedFilesForRender(): AutofixRequestModel['changedFiles'] {
    if (this.args.autofixRequest.status === 'in_progress') {
      return [
        {
          filename: 'placeholder.txt', // TODO: This should be the actual filename
          diff: `
  def main():
-     print("Hello, world!")
+     print("Hello, worlds!")

+     foo = calculate(bar)

  if __name__ == "__main__":
      main()
`,
        },
      ];
    } else {
      return this.args.autofixRequest.changedFiles;
    }
  }

  get diffIsHidden() {
    // We never show a diff unless the autofix request is successful
    if (this.args.autofixRequest.status !== 'success') {
      return true;
    }

    return !this.diffWasUnblurred;
  }

  get explanationIsBlurred() {
    if (this.args.autofixRequest.status !== 'success') {
      return true;
    }

    return !this.explanationWasUnblurred;
  }

  @action
  handleShowExplanationButtonClick() {
    if (this.explanationIsBlurred) {
      this.analyticsEventTracker.track('revealed_autofix_explanation', { autofix_request_id: this.args.autofixRequest.id });
    }

    this.explanationWasUnblurred = true;
  }

  @action
  handleToggleFixedCodeButtonClick() {
    if (this.diffIsHidden) {
      this.analyticsEventTracker.track('revealed_autofix_diff', { autofix_request_id: this.args.autofixRequest.id });
      this.diffWasUnblurred = true;
    } else {
      // this.analyticsEventTracker.track('hidden_autofix_diff', { autofix_request_id: this.args.autofixRequest.id });
      this.diffWasUnblurred = false;
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::TestResultsBar::AutofixRequestCard': typeof AutofixRequestCard;
  }
}
