import Component from '@glimmer/component';

interface Signature {
  Element: HTMLElement;
}

export default class OutdatedClientBadgeComponent extends Component<Signature> {
  handleClick() {
    window.location.reload();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    OutdatedClientBadge: typeof OutdatedClientBadgeComponent;
  }
}
