import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;
  Args: {
    size: 'small' | 'large';
  };
}

export default class MemberBadgeComponent extends Component<Signature> {
  get size() {
    // Default to small if not provided
    return this.args.size || 'small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::MemberBadge': typeof MemberBadgeComponent;
  }
}
