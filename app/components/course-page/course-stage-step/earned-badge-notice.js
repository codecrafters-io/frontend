import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class EarnedBadgeNoticeComponent extends Component {
  @tracked selectedBadge;

  @action
  handleBadgeClicked(badge) {
    this.selectedBadge = badge;
  }

  @action
  handleViewButtonClicked() {
    this.selectedBadge = this.args.badgeAwards[0].badge;
  }

  handleBadgeModalClose() {
    this.selectedBadge = null;
  }
}
