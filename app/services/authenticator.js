import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import window from 'ember-window-mock';

export default class AuthenticatorService extends Service {
  @service router;
  @service sessionTokenStorage;
  @service currentUserCacheStorage;
  @service store;

  // TODO: See if there's a way around using this
  @tracked isLoadingUser = false;
  @tracked cacheBuster = 0;

  async authenticate() {
    if (!this.sessionTokenStorage.hasToken) {
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

    this.isLoadingUser = true;
    const user = await this.store.createRecord('user').fetchCurrent({ include: includedResources.join(',') });
    this.isLoadingUser = false;

    if (!user) {
      this.sessionTokenStorage.clear();
      this.currentUserCacheStorage.clear();

      return;
    }

    this.currentUserCacheStorage.setValues(user.id, user.username);
    this.cacheBuster++;
  }

  get currentUser() {
    this.cacheBuster; // Force reload on cacheBuster change

    if (this.currentUserCacheStorage.userId) {
      return this.store.peekRecord('user', this.currentUserCacheStorage.userId);
    } else {
      return null;
    }
  }

  get currentUserIsLoaded() {
    this.cacheBuster; // Force reload on cacheBuster change

    return !!this.currentUser;
  }

  get currentUserId() {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.id : this.currentUserCacheStorage.userId;
  }

  get currentUsername() {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.username : this.currentUserCacheStorage.username;
  }

  initiateLogin(redirectPath) {
    if (redirectPath) {
      window.location.href = '/login?next=' + encodeURIComponent(`${window.origin}${redirectPath}`);
    } else {
      window.location.href = '/login?next=' + encodeURIComponent(`${window.origin}${this.router.currentURL}`);
    }
  }

  logout() {
    this.sessionTokenStorage.clear();
    this.currentUserCacheStorage.clear();
    this.cacheBuster++;
  }

  get isAnonymous() {
    this.cacheBuster; // Force reload on cacheBuster change

    return !this.isAuthenticated;
  }

  get isAuthenticated() {
    this.cacheBuster; // Force reload on cacheBuster change

    return this.sessionTokenStorage.hasToken;
  }
}
