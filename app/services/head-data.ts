import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class HeadDataService extends Service {
  @tracked title?: string;
  @tracked description?: string;
  @tracked imageUrl?: string;
  @tracked type?: string;
  @tracked siteName?: string;
  @tracked twitterCard?: string;
  @tracked twitterSite?: string;

  // @ts-ignore
  defaults: object = config.x.defaultMetaTags;
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
