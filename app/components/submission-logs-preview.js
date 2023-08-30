import Component from '@glimmer/component';
import { AnsiUp } from 'ansi_up';
import { action } from '@ember/object';
import { cached } from '@glimmer/tracking';

export default class SubmissionLogsPreviewComponent extends Component {
  get evaluation() {
    return this.args.submission.evaluations.firstObject;
  }

  @action
  handleDidInsert(element) {
    element.scrollTop = element.scrollHeight;
  }

  @cached
  get logLines() {
    return this.evaluation.parsedLogs
      .trim()
      .split('\n')
      .map((line) => {
        return new AnsiUp().ansi_to_html(line);
      });
  }
}
