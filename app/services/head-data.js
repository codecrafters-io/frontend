// If translated into TypeScript, this file gets overriden
// with `addon/head-data.js` from `ember-cli-head` addon.
// This started happening since updating embroider packages
// @embroider/webpack & @embroider/compat from 3.0.0 to 3.2.0

import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class HeadDataService extends Service {
  @tracked title;
  @tracked description;
  @tracked imageUrl;
  @tracked type;
  @tracked siteName;
  @tracked twitterCard;
  @tracked twitterSite;

  defaults = config.x.defaultMetaTags;
}
