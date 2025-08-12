import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;
}

export default class OutdatedClientBadge extends Component<Signature> {
  handleClick() {
    window.location.reload();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    OutdatedClientBadge: typeof OutdatedClientBadge;
  }
}
