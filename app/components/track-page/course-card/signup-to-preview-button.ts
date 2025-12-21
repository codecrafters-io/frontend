import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class SignupToPreviewButton extends Component {
  @service declare authenticator: AuthenticatorService;

  @action
  handleClicked() {
    this.authenticator.initiateLogin();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::SignupToPreviewButton': typeof SignupToPreviewButton;
  }
}
