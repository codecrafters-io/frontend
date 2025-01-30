import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;
  Args: {
    size: 'small' | 'large';
  };
}

export default class MemberBadgeComponent extends Component<Signature> {
  get linkButtonSize() {
    // arg:small -> PrimaryLinkButton size:extra-small
    // arg:large -> small
    return this.args.size === 'large' ? 'small' : 'extra-small';
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'BillingStatusBadge::MemberBadge': typeof MemberBadgeComponent;
  }
}
