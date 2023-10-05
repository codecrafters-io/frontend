import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { tracked } from '@glimmer/tracking';

export default class ButtonWithProgressIndicatorComponent extends Component {
  @tracked isHovered = false;
  @tracked progressWidth = 100;
  @tracked progressInterval = 100;

  get progressBarWidthStyle() {
    return htmlSafe(`width: ${this.progressWidth}%`);
  }

  @action
  showProgressBar() {
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
        console.log('print this');
        clearInterval(this.progressInterval);
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
