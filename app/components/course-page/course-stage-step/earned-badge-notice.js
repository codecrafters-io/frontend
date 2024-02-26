import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EarnedBadgeNoticeComponent extends Component {
  @tracked selectedBadge;

  @action
  handleBadgeClicked(badge) {
    this.selectedBadge = badge;
  }

  handleBadgeModalClose() {
    this.selectedBadge = null;
  }

  @action
  handleClick() {
    this.selectedBadge = this.args.badgeAwards[0].badge;
  }
}
