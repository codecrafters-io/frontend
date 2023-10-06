import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';

export default class BadgesController extends Controller {
  transition = fade;
  @tracked selectedBadge = null;

  get otherBadgesCount() {
    return 21 - this.model.badges.length;
  }

  get sortedBadges() {
    return this.model.badges.sortBy('priority');
  }

  @action
  handleBadgeCardClicked(badge) {
    if (badge.currentUserAwards.length > 0) {
      this.selectedBadge = badge;
    }
  }
}
