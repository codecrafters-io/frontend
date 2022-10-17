import Component from '@glimmer/component';
import * as Sentry from '@sentry/ember';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UpgradePromptComponent extends Component {
  @service('router') router;
  @service('current-user') currentUserService;

  @action
  handleSubscribeLinkClicked() {
    this.router.transitionTo('pay');
  }

  get freeUsageRestrictionExpiresAt() {
    if (this.currentUserService.record.freeUsageRestriction) {
      return this.currentUserService.record.freeUsageRestriction.expiresAt;
    } else {
      Sentry.captureMessage('Upgrade prompt rendered for user with no free usage restriction');

      return null;
    }
  }
}
