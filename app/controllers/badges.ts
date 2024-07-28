import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import fade from 'ember-animated/transitions/fade';
import type { ModelType } from 'codecrafters-frontend/routes/badges';
import type BadgeModel from 'codecrafters-frontend/models/badge';

export default class BadgesController extends Controller {
  declare model: ModelType;

  transition = fade;
  @tracked selectedBadge: BadgeModel | null = null;

  get otherBadgesCount() {
    return 21 - this.model.badges.length;
  }

  get sortedBadges() {
    return this.model.badges.sortBy('priority');
  }

  @action
  handleBadgeCardClicked(badge: BadgeModel) {
    if (badge.currentUserAwards.length > 0) {
      this.selectedBadge = badge;
    }
  }
}
