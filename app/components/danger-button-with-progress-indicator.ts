import Component from '@glimmer/component';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    deferredFunction: () => void;
    redirectTo?: string;
    size?: string;
  };

  Blocks: {
    default: [];
  };
}

export default class DangerButtonWithProgressIndicatorComponent extends Component<Signature> {
  @service declare router: RouterService;
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
        this.args.deferredFunction();
        clearInterval(this.progressInterval);

        if (this.args.redirectTo) {
          this.router.transitionTo(this.args.redirectTo);
        }
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
