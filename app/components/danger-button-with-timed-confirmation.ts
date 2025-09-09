import Component from '@glimmer/component';
import config from 'codecrafters-frontend/config/environment';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    onConfirm: () => void;
    size?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButtonWithTimedConfirmation extends Component<Signature> {
  @tracked shouldShowProgressBar: boolean = false;
  @tracked progressWidth: number = 0;
  @tracked progressInterval: number | undefined = undefined;

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressWidth}%`);
  }

  @action
  startProgress(event: Event) {
    event.preventDefault(); // Prevent menu from popping up, which triggers touchup
    this.stopProgress();

    this.shouldShowProgressBar = true;
    const intervalDelay = config.environment === 'test' ? 1 : 30;
    this.progressInterval = setInterval(() => {
      if (this.progressWidth < 100) {
        this.progressWidth += 1;
      } else if (this.progressWidth === 100) {
        clearInterval(this.progressInterval);

        this.args.onConfirm();
      } else {
        clearInterval(this.progressInterval);
      }
    }, intervalDelay);
  }

  @action
  stopProgress() {
    this.shouldShowProgressBar = false;
    this.progressWidth = 0;
    clearInterval(this.progressInterval);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DangerButtonWithTimedConfirmation: typeof DangerButtonWithTimedConfirmation;
  }
}
