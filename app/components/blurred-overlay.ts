import Component from '@glimmer/component';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    isBlurred: boolean;
    onOverlayClick?: () => void;
    overlayClass?: string;
  };

  Blocks: {
    content: [];
    overlay: [];
  };
}

export default class BlurredOverlay extends Component<Signature> {
  @action
  handleOverlayClick(event: MouseEvent) {
    if (event.target === event.currentTarget && this.args.onOverlayClick) {
      this.args.onOverlayClick();
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    BlurredOverlay: typeof BlurredOverlay;
  }
}
