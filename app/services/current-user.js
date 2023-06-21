import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @service router;
  @service store;
  @service sessionTokenStorage;

  @tracked currentUserId = null;
  @tracked isAuthenticating = false;
  @tracked currentSession = false;

  async authenticate() {
    if (!this.sessionTokenStorage.hasToken) {
      return;
    }

    if (this.isAuthenticated) {
      return;
    }

    const includedResources = [
      'feature_suggestions',
      'referral_activations_as_customer.referrer',
      'referral_links',
      'referral_links.user',
      'team_memberships',
      'team_memberships.team.memberships.user',
      'team_memberships.team.subscriptions',
      'team_memberships.team.pilots',
      'team_memberships.team.payment_methods',
      'subscriptions',
      'subscriptions.user',
    ];

    this.isAuthenticating = true;
    const user = await this.store.createRecord('user').fetchCurrent({ include: includedResources.join(',') });
    this.isAuthenticating = false;

    if (!user) {
      this.sessionTokenStorage.clearToken();

      return;
    }

    this.currentUserId = user.id;
  }

  // Useful in cases where we don't want to wait for the session request to go through
  get couldBeAuthenticated() {
    return this.sessionTokenStorage.hasToken;
  }

  // TODO: Change this to handle situations where authenticate hasn't been called yet.
  get currentUserUsername() {
    return this.record?.username;
  }

  get isAnonymous() {
    return !this.isAuthenticated;
  }

  get isAuthenticated() {
    return !!this.currentUserId;
  }

  get record() {
    if (this.isAuthenticated) {
      return this.store.peekRecord('user', this.currentUserId);
    } else {
      return null;
    }
  }
}
