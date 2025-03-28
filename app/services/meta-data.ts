import type RouterService from '@ember/routing/router-service';
import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import RouteInfoMetadata from 'codecrafters-frontend/utils/route-info-metadata';

export default class HeadDataService extends Service {
  @service declare router: RouterService;

  get shouldRenderNoIndexTag() {
    const routeMeta = this.router.currentRoute.metadata;
    const allowsAnonymousAccess = routeMeta instanceof RouteInfoMetadata && routeMeta.allowsAnonymousAccess;

    return !allowsAnonymousAccess;
  }

  @tracked title?: string;
  @tracked description?: string;
  @tracked imageUrl?: string;
  @tracked type?: string;
  @tracked siteName?: string;
  @tracked twitterCard?: string;
  @tracked twitterSite?: string;
}

// Don't remove this declaration: this is what enables TypeScript to resolve
// this service using `Owner.lookup('service:head-data')`, as well
// as to check when you pass the service name as an argument to the decorator,
// like `@service('head-data') declare altName: HeadDataService;`.
declare module '@ember/service' {
  interface Registry {
    'head-data': HeadDataService;
  }
}
