import Component from '@glimmer/component';

interface Signature {
  Element: HTMLElement;

  Args: {
    testimonial: {
      authorAvatarImage: string;
      authorDesignation: string;
      authorName: string;
      link?: string;
      text: string;
    };
  };
}

export default class TestimonialListItemComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'AffiliateLinkPage::TestimonialListItem': typeof TestimonialListItemComponent;
  }
}
