import Helper from '@ember/component/helper';
import config from 'codecrafters-frontend/config/environment';

export default class AssetURLHelper extends Helper {
  compute([relativeURL]) {
    return config.assetsHostURL + relativeURL;
  }
}
