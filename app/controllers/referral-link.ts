import Controller from '@ember/controller';
import FreeUsageGrantModel from 'codecrafters-frontend/models/free-usage-grant';
import ReferralLinkModel from 'codecrafters-frontend/models/referral-link';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

export default class ReferralLinkController extends Controller {
  declare model: { acceptedReferralOfferFreeUsageGrant: FreeUsageGrantModel; referralLink: ReferralLinkModel };

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
}
