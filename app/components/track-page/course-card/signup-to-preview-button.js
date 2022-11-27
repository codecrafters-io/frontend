import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import window from 'ember-window-mock';

export default class SignupToPreviewButton extends Component {
  @service router;

  @action
  handleClicked() {
    window.location.href = '/login?next=' + encodeURIComponent(this.router.currentURL);
  }
}
