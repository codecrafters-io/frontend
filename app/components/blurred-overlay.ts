import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isBlurred: boolean;
    overlayClass?: string;
  };

  Blocks: {
    content: [];
    overlay: [];
  };
}

export default class BlurredOverlay extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlurredOverlay: typeof BlurredOverlay;
  }
}
