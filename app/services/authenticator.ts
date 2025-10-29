import config from 'codecrafters-frontend/config/environment';
import CurrentUserCacheStorageService from 'codecrafters-frontend/services/current-user-cache-storage';
import RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';
import SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
import { tracked } from '@glimmer/tracking';
import type UserModel from 'codecrafters-frontend/models/user';

export default class AuthenticatorService extends Service {
  @service declare router: RouterService;
  @service declare sessionTokenStorage: SessionTokenStorageService;
  @service declare currentUserCacheStorage: CurrentUserCacheStorageService;
  @service declare store: Store;

  // TODO: See if there's a way around using this
  @tracked isLoadingUser: boolean = false;
  @tracked cacheBuster: number = 0;

  get currentUser() {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    if (this.currentUserCacheStorage.userId) {
      return this.store.peekRecord('user', this.currentUserCacheStorage.userId) as UserModel;
    } else {
      return null;
    }
  }

  get currentUserId(): string | null {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.id : this.currentUserCacheStorage.userId;
  }

  get currentUserIsLoaded(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    return !!this.currentUser;
  }

  get currentUsername(): string | null {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    return this.currentUser ? this.currentUser.username : this.currentUserCacheStorage.username;
  }

  get isAnonymous(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    return !this.isAuthenticated;
  }

  get isAuthenticated(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.cacheBuster; // Force reload on cacheBuster change

    return this.sessionTokenStorage.hasToken;
  }

  async authenticate(): Promise<void> {
    if (this.currentUserIsLoaded) {
      return;
    }

    await this.syncCurrentUser();
  }

  initiateLogin() {
    if (this.router.currentURL) {
      this.initiateLoginAndRedirectTo(`${window.origin}${this.router.currentURL}`);
    } else {
      this.initiateLoginAndRedirectTo(window.origin);
    }
  }

  initiateLoginAndRedirectTo(redirectPathOrUrl: string) {
    const redirectUrl = redirectPathOrUrl.startsWith('/') ? `${window.origin}${redirectPathOrUrl}` : redirectPathOrUrl;

    window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(redirectUrl);
  }

  logout(): void {
    // eslint-disable-next-line ember/no-array-prototype-extensions
    this.sessionTokenStorage.clear();
    // eslint-disable-next-line ember/no-array-prototype-extensions
    this.currentUserCacheStorage.clear();
    this.cacheBuster++;
  }

  prefillBeaconEmail() {
    // @ts-expect-error Beacon not typed
    if (window.Beacon && this.currentUser && this.currentUser.primaryEmailAddress) {
      // @ts-expect-error Beacon not typed
      window.Beacon('prefill', {
        email: this.currentUser.primaryEmailAddress,
      });
    }
  }

  async syncCurrentUser() {
    if (!this.sessionTokenStorage.hasToken) {
      return;
    }

    const includedResources = [
      'affiliate-links',
      'affiliate-links.user',
      'feature-suggestions',
      'promotional-discounts',
      'promotional-discounts.affiliate-referral',
      'promotional-discounts.affiliate-referral.affiliate-link',
      'promotional-discounts.affiliate-referral.affiliate-link.user',
      'promotional-discounts.affiliate-referral.referrer',
      'promotional-discounts.user',
      'referral-activations-as-customer.referrer',
      'referral-links',
      'referral-links.user',
      'subscriptions',
      'subscriptions.source',
      'subscriptions.source.institution',
      'subscriptions.user',
      'team-memberships',
      'team-memberships.team.memberships.user',
      'team-memberships.team.payment-methods',
      'team-memberships.team.pilots',
      'team-memberships.team.subscriptions',
    ];

    const user = await this.store.createRecord('user').fetchCurrent({ include: includedResources.join(',') });

    // We reached here since sessionToken has a token, and that token is now invalid. Clear and force a refresh!
    if (!user) {
      this.logout();
      window.location.reload();

      return;
    }

    this.prefillBeaconEmail();
    this.currentUserCacheStorage.setValues(user.id, user.username);
    this.cacheBuster++;
  }
}
