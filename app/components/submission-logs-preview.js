import Component from '@glimmer/component';
import { default as AnsiUp } from 'ansi_up';
import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';

export default class SubmissionLogsPreviewComponent extends Component {
  get evaluation() {
    return this.args.submission.evaluations.firstObject;
  }

  @action
  handleDidInsert(element) {
    element.scrollTop = element.scrollHeight;
  }

  get logLines() {
    return this.evaluation.parsedLogs
      .trim()
      .split('\n')
      .map((line) => {
        return htmlSafe(new AnsiUp().ansi_to_html(line));
      });
  }
}
