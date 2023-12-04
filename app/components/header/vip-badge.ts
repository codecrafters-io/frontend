import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class VipBadgeComponent extends Component<Signature> { }

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Header::VipBadge': typeof VipBadgeComponent;
  }
}
