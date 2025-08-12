import Component from '@glimmer/component';
import type { Testimonial } from 'codecrafters-frontend/utils/testimonials-data';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    testimonial: Testimonial;
  };
}

export default class TestimonialListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::TestimonialListItem': typeof TestimonialListItem;
  }
}
