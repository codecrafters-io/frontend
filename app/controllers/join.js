import Controller from '@ember/controller';
import testimonialsData from 'codecrafters-frontend/lib/testimonials-data';

export default class JoinController extends Controller {
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
