import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;

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

export default class TestimonialListItem extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'ReferralLinkPage::TestimonialListItem': typeof TestimonialListItem;
  }
}
