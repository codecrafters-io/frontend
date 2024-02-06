import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';

export default class SignupToPreviewButtonComponent extends Component {
  @service declare authenticator: AuthenticatorService;

  @action
  handleClicked() {
    this.authenticator.initiateLogin(null);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard::SignupToPreviewButton': typeof SignupToPreviewButtonComponent;
  }
}
