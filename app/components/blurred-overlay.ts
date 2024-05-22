import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isBlurred: boolean;
  };

  Blocks: {
    content: [];
    overlay: [];
  };
}

export default class BlurredOverlayComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlurredOverlay: typeof BlurredOverlayComponent;
  }
}
