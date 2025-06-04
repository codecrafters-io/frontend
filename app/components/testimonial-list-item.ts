import Component from '@glimmer/component';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    testimonial: Testimonial;
  };
}

export default class TestimonialListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TestimonialListItem: typeof TestimonialListItemComponent;
  }
}
