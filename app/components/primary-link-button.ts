import Component from '@glimmer/component';
import { type BaseLinkButtonSignature } from './base-link-button';

interface Signature {
  Element: HTMLAnchorElement;

  Args: BaseLinkButtonSignature['Args'];

  Blocks: {
    default: [];
  };
}

export default class PrimaryLinkButtonComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    PrimaryLinkButton: typeof PrimaryLinkButtonComponent;
  }
}
