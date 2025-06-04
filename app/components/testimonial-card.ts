import Component from '@glimmer/component';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

interface Signature {
  Args: {
    testimonial: Testimonial;
  };
}

export default class TestimonialCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TestimonialCard: typeof TestimonialCard;
  }
}
