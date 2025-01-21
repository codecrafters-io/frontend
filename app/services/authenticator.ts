import config from 'codecrafters-frontend/config/environment';
import CurrentUserCacheStorageService from 'codecrafters-frontend/services/current-user-cache-storage';
import RouterService from '@ember/routing/router-service';
import Service, { inject as service } from '@ember/service';
import SessionTokenStorageService from 'codecrafters-frontend/services/session-token-storage';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
import { tracked } from '@glimmer/tracking';

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
      return this.store.peekRecord('user', this.currentUserCacheStorage.userId);
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

  initiateLogin(redirectPath: string | null) {
    if (redirectPath) {
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(`${window.origin}${redirectPath}`);
    } else if (this.router.currentURL) {
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(`${window.origin}${this.router.currentURL}`);
    } else {
      window.location.href = `${config.x.backendUrl}/login?next=` + encodeURIComponent(window.origin);
    }
  }

  logout(): void {
    this.sessionTokenStorage.clear();
    this.currentUserCacheStorage.clear();
    this.cacheBuster++;
  }

  prefillBeaconEmail() {
    //@ts-ignore
    if (window.Beacon && this.currentUser && this.currentUser.primaryEmailAddress) {
      //@ts-ignore
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
