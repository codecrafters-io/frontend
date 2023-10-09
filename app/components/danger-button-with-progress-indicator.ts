import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    deferredFunction: () => void;
    onConfirm: () => void;
    size?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButtonWithProgressIndicatorComponent extends Component<Signature> {
  @tracked isHovered: boolean = false;
  @tracked progressWidth: number = 100;
  @tracked progressInterval: number = 100;

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressWidth}%`);
  }

  @action
  handleMouseEnter() {
    this.isHovered = true;
  }

  @action
  handleMouseLeave() {
    this.hideProgressBar();
    this.stopProgress();
  }

  @action
  hideProgressBar() {
    this.isHovered = false;
  }

  @action
  startProgress() {
    this.progressWidth = 100;

    this.progressInterval = setInterval(() => {
      if (this.progressWidth > 0) {
        this.progressWidth -= 1;
      } else if (this.progressWidth === 0) {
        clearInterval(this.progressInterval);

        this.args.deferredFunction();
        this.args.onConfirm();
      } else {
        clearInterval(this.progressInterval);
      }
    }, 50);
  }

  @action
  stopProgress() {
    this.progressWidth = 100;
    clearInterval(this.progressInterval);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DangerButtonWithProgressIndicator: typeof DangerButtonWithProgressIndicatorComponent;
  }
}
