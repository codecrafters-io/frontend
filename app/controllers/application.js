import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'codecrafters-frontend/config/environment';

export default class ApplicationController extends Controller {
  @service layout;
  @service metaData;
  @service darkMode;

  metaDataDefaults = config.x.defaultMetaTags;
}
