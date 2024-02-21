import Component from '@glimmer/component';
import { AnsiUp } from 'ansi_up';
import { action } from '@ember/object';

// @ts-ignore
import { cached, tracked } from '@glimmer/tracking';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class SubmissionLogsPreviewComponent extends Component<Signature> {
  @tracked isLoadingLogs = false;

  get evaluation() {
    return this.args.submission.evaluations[0];
  }

  @cached
  get logLines() {
    if (!this.evaluation || !this.evaluation.logsFileContents) {
      return ['Logs for this submission are not available.', 'Think this is a CodeCrafters error? Let us know at hello@codecrafters.io.'];
    } else {
      return this.evaluation.logsFileContents
        .trim()
        .split('\n')
        .map((line: string) => {
          return new AnsiUp().ansi_to_html(line);
        });
    }
  }

  @action
  async handleDidInsert(element: HTMLElement) {
    element.scrollTop = element.scrollHeight;

    this.handleDidUpdateEvaluation();
  }

  @action
  async handleDidUpdateEvaluation() {
    if (this.evaluation) {
      this.isLoadingLogs = true;
      await this.evaluation.fetchLogsFileContentsIfNeeded();
      this.isLoadingLogs = false;
    }
  }

  handleDidUpdateLogs(element: HTMLElement) {
    element.scrollTop = element.scrollHeight;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    SubmissionLogsPreview: typeof SubmissionLogsPreviewComponent;
  }
}
