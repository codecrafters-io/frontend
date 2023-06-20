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
      'user',
      'user.feature_suggestions',
      'user.referral_activations_as_customer.referrer',
      'user.referral_links',
      'user.referral_links.user',
      'user.team_memberships',
      'user.team_memberships.team.memberships.user',
      'user.team_memberships.team.subscriptions',
      'user.team_memberships.team.pilots',
      'user.team_memberships.team.payment_methods',
      'user.subscriptions',
      'user.subscriptions.user',
    ];

    this.isAuthenticating = true;
    const session = (await this.store.query('session', { include: includedResources.join(',') }))[0];
    this.isAuthenticating = false;

    if (!session) {
      this.sessionTokenStorage.clearToken();

      return;
    }

    this.currentUserId = session.user.id;
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
