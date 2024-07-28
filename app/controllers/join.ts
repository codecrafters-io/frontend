import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import BYOXBanner from '/assets/images/affiliate-program-features/byox-banner.svg';
import BYOXBannerMobile from '/assets/images/affiliate-program-features/byox-banner-mobile.svg';
import type { ModelType } from 'codecrafters-frontend/routes/join';

export default class JoinController extends Controller {
  declare model: ModelType;

  BYOXBanner = BYOXBanner;
  BYOXBannerMobile = BYOXBannerMobile;
  queryParams = [{ affiliateLinkSlug: 'via' }];

  get testimonialGroups() {
    const testimonialGroup1 = [
      testimonialsData['djordje-lukic'],
      testimonialsData['ananthalakshmi-sankar'],
      testimonialsData['raghav-dua'],
      testimonialsData['rahul-tarak'],
    ];

    const testimonialGroup2 = [
      testimonialsData['charles-guo'],
      testimonialsData['akshata-mohan'],
      testimonialsData['pranjal-paliwal'],
      testimonialsData['beyang-liu'],
    ];

    const testimonialGroup3 = [
      testimonialsData['beyang-liu'],
      testimonialsData['kang-ming-tay'],
      testimonialsData['jonathan-lorimer'],
      testimonialsData['patrick-burris'],
    ];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }
}
