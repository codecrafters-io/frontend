import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';
import type { InstitutionRouteModel } from 'codecrafters-frontend/routes/institution';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class InstitutionController extends Controller {
  declare model: InstitutionRouteModel;

  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;

  @tracked campusProgramApplicationModalIsOpen = false;

  get testimonialGroups(): Testimonial[][] {
    const testimonialGroup1 = [
      testimonialsData['djordje-lukic']!,
      testimonialsData['ananthalakshmi-sankar']!,
      testimonialsData['raghav-dua']!,
      testimonialsData['rahul-tarak']!,
    ];

    const testimonialGroup2 = [
      testimonialsData['charles-guo']!,
      testimonialsData['akshata-mohan']!,
      testimonialsData['pranjal-paliwal']!,
      testimonialsData['joey-pereira']!,
    ];

    const testimonialGroup3 = [
      testimonialsData['beyang-liu']!,
      testimonialsData['kang-ming-tay']!,
      testimonialsData['jonathan-lorimer']!,
      testimonialsData['patrick-burris']!,
    ];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }

  @action
  handleCampusProgramApplicationModalClose() {
    this.campusProgramApplicationModalIsOpen = false;
  }

  @action
  handleClaimOfferButtonClick() {
    this.campusProgramApplicationModalIsOpen = true;
  }
}
