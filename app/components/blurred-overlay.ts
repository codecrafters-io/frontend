import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isBlurred: boolean;
    onUnblur: () => void;
  };

  Blocks: {
    default: [];
  };
}

export default class BlurredOverlayComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlurredOverlay: typeof BlurredOverlayComponent;
  }
}
