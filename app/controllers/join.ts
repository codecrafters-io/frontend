import Controller from '@ember/controller';
import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import type { ModelType } from 'codecrafters-frontend/routes/join';

export default class JoinController extends Controller {
  declare model: ModelType;

  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;
  queryParams = [{ affiliateLinkSlug: 'via' }];
}
