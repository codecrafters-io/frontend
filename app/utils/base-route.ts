import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import paramsFromRouteInfo from 'codecrafters-frontend/utils/params-from-route-info';
import posthog from 'posthog-js';
import window from 'ember-window-mock';
import { inject as service } from '@ember/service';

type Transition = ReturnType<RouterService['transitionTo']>;

export default class BaseRoute extends Route {
  allowsAnonymousAccess = false;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service utmCampaignIdTracker: unknown;
  @service declare fastboot: FastBootService;

  beforeModel(transition: Transition) {
    this.authenticator.authenticate();

    // Routes attempting to call `initiateLogin` don't support FastBoot at this time
    if (!this.allowsAnonymousAccess && this.fastboot.isFastBoot) {
      throw new Error('FastBoot is not supported on routes without "allowsAnonymousAccess=true"');
    }

    if (!this.allowsAnonymousAccess && !this.authenticator.isAuthenticated) {
      const params = paramsFromRouteInfo(transition.to);

      if (params.length > 0) {
        const paramValues = params.map(([_, value]) => value);
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name, ...paramValues));
      } else {
        this.authenticator.initiateLogin(this.router.urlFor(transition.to.name));
      }

      transition.abort();
    }

    // TODO: Handle case where `isAuthenticated` isn't present yet
    if (!this.fastboot.isFastBoot && window.origin.includes('codecrafters.io')) {
      if (this.authenticator.currentUserId) {
        posthog.identify(this.authenticator.currentUserId, { username: this.authenticator.currentUsername });
      }
    }

    const queryParams = transition.to.queryParams;

    if (queryParams['r'] && /^\d[a-zA-Z][a-zA-Z]$/.test(queryParams['r'])) {
      // @ts-ignore
      this.utmCampaignIdTracker.setCampaignId(queryParams['r']);
      delete queryParams['r'];
      this.router.replaceWith(transition.to.name, { queryParams });
    }
  }
}
