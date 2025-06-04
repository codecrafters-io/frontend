import Component from '@glimmer/component';
import testimonialsData from 'codecrafters-frontend/utils/testimonials-data';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

interface Signature {
  Element: HTMLDivElement;
}

export default class TestimonialListComponent extends Component<Signature> {
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TestimonialList: typeof TestimonialListComponent;
  }
}
