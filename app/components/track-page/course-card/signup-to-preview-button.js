import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class SignupToPreviewButton extends Component {
  @service authentication;

  @action
  handleClicked() {
    this.authentication.initiateLogin();
  }
}
