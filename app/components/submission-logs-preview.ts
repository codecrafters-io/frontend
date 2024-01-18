import Component from '@glimmer/component';
import { AnsiUp } from 'ansi_up';
import { action } from '@ember/object';

// @ts-ignore
import { cached } from '@glimmer/tracking';
import type SubmissionModel from 'codecrafters-frontend/models/submission';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    submission: SubmissionModel;
  };
}

export default class SubmissionLogsPreviewComponent extends Component<Signature> {
  get evaluation() {
    return this.args.submission.evaluations[0];
  }

  @cached
  get logLines() {
    if (!this.evaluation) {
      return ['Logs for this submission are not available.', 'Think this is a CodeCrafters error? Let us know at hello@codecrafters.io.'];
    } else {
      return this.evaluation.parsedLogs
        .trim()
        .split('\n')
        .map((line: string) => {
          return new AnsiUp().ansi_to_html(line);
        });
    }
  }

  @action
  handleDidInsert(element: HTMLElement) {
    element.scrollTop = element.scrollHeight;
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
