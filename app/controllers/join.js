import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import ccBanner from '/assets/images/affiliate-program-features/backed-by-ycombinator.png';

export default class JoinController extends Controller {
  ccBanner = ccBanner;
  queryParams = [{ affiliateLinkSlug: 'via' }];

  get testimonialGroups() {
    let testimonialGroup1 = [
      testimonialsData['djordje-lukic'],
      testimonialsData['ananthalakshmi-sankar'],
      testimonialsData['raghav-dua'],
      testimonialsData['rahul-tarak'],
    ];

    let testimonialGroup2 = [
      testimonialsData['charles-guo'],
      testimonialsData['akshata-mohan'],
      testimonialsData['pranjal-paliwal'],
      testimonialsData['beyang-liu'],
    ];

    let testimonialGroup3 = [
      testimonialsData['beyang-liu'],
      testimonialsData['kang-ming-tay'],
      testimonialsData['jonathan-lorimer'],
      testimonialsData['patrick-burris'],
    ];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }
}
