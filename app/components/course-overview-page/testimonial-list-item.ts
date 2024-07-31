import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    testimonial: CourseModel['testimonials'][number];
  };
}

export default class TestimonialListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CourseOverviewPage::TestimonialListItem': typeof TestimonialListItemComponent;
  }
}
