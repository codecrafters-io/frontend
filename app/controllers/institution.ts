import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import Controller from '@ember/controller';
import type { InstitutionRouteModel } from 'codecrafters-frontend/routes/institution';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InstitutionController extends Controller {
  declare model: InstitutionRouteModel;

  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;

  @tracked campusProgramApplicationModalIsOpen = false;

  @action
  handleCampusProgramApplicationModalClose() {
    this.campusProgramApplicationModalIsOpen = false;
  }

  @action
  handleClaimOfferButtonClick() {
    this.campusProgramApplicationModalIsOpen = true;
  }
}
