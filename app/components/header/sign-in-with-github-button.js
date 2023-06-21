import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class HeaderSignInWithGithubButton extends Component {
  @service authenticator;

  @action
  handleClicked() {
    this.authenticator.initiateLogin();
  }
}
