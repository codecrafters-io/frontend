import Component from '@glimmer/component';

interface Signature {
  Element: HTMLAnchorElement;
}

export default class MemberBadgeComponent extends Component<Signature> { }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::MemberBadge': typeof MemberBadgeComponent;
  }
}
