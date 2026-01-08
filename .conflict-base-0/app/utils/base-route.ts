import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import FastBootService from 'ember-cli-fastboot/services/fastboot';
import Route from '@ember/routing/route';
import RouterService from '@ember/routing/router-service';
import paramsFromRouteInfo from 'codecrafters-frontend/utils/params-from-route-info';
import { posthog } from 'posthog-js';
import window from 'ember-window-mock';
import { service } from '@ember/service';
import RouteInfoMetadata from './route-info-metadata';

type Transition = ReturnType<RouterService['transitionTo']>;

export default class BaseRoute extends Route {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare utmCampaignIdTracker: unknown;
  @service declare fastboot: FastBootService;

  beforeModel(transition: Transition) {
    this.authenticator.authenticate();

    const routeMeta = this.buildRouteInfoMetadata();
    const allowsAnonymousAccess = routeMeta instanceof RouteInfoMetadata && routeMeta.allowsAnonymousAccess;

    // Routes attempting to call `initiateLogin` don't support FastBoot at this time
    if (!allowsAnonymousAccess && this.fastboot.isFastBoot) {
      throw new Error('FastBoot is not supported on routes without "allowsAnonymousAccess=true"');
    }

    if (!allowsAnonymousAccess && !this.authenticator.isAuthenticated) {
      const params = transition.to ? paramsFromRouteInfo(transition.to) : [];

      if (params.length > 0) {
        const paramValues = params.map(([_, value]) => value);
        this.authenticator.initiateLoginAndRedirectTo(this.router.urlFor(transition.to?.name || 'catalog', ...paramValues));
      } else {
        this.authenticator.initiateLoginAndRedirectTo(this.router.urlFor(transition.to?.name || 'catalog'));
      }

      transition.abort();
    }

    // TODO: Handle case where `isAuthenticated` isn't present yet
    if (!this.fastboot.isFastBoot && window.origin.includes('codecrafters.io')) {
      if (this.authenticator.currentUserId) {
        posthog.identify(this.authenticator.currentUserId, { username: this.authenticator.currentUsername });
      }
    }

    const queryParams = transition.to?.queryParams;

    if (!this.fastboot.isFastBoot && queryParams && queryParams['r'] && /^\d[a-zA-Z][a-zA-Z]$/.test(queryParams['r'])) {
      // @ts-expect-error utmCampaignIdTracker service not typed
      this.utmCampaignIdTracker.setCampaignId(queryParams['r']);
      delete queryParams['r'];
      this.router.replaceWith(transition.to.name, { queryParams });
    }
  }
}
