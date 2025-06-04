import Component from '@glimmer/component';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

export default class TestimonialListComponent extends Component {
  get testimonialGroups(): Testimonial[][] {
    const testimonialGroup1 = [
      testimonialsData['ananthalakshmi-sankar']!,
      testimonialsData['raghav-dua']!,
      testimonialsData['charles-guo']!,
      testimonialsData['patrick-burris']!,
    ];
    const testimonialGroup2 = [
      testimonialsData['beyang-liu']!,
      testimonialsData['kang-ming-tay']!,
      testimonialsData['djordje-lukic']!,
      testimonialsData['rahul-tarak']!,
      testimonialsData['cindy-wu']!,
    ];
    const testimonialGroup3 = [
      testimonialsData['jonathan-lorimer']!,
      testimonialsData['akshata-mohan']!,
      testimonialsData['pranjal-paliwal']!,
      testimonialsData['vladislav-ten']!,
    ];

    return [testimonialGroup1, testimonialGroup2, testimonialGroup3];
  }
}
