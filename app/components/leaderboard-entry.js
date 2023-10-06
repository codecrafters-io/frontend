import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';

export default class LeaderboardEntryComponent extends Component {
  get isSkeleton() {
    return !this.args.user;
  }

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressPercentage}%;`);
  }

  get progressPercentage() {
    return 100 * (this.args.progressNumerator / this.args.progressDenominator);
  }
}
