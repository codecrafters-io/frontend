import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import RouterService from '@ember/routing/router-service';
import type { BaseButtonSignature } from '../base-button';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    courses: CourseModel[];
    language: LanguageModel;
    size?: BaseButtonSignature['Args']['size'];
  };
}

export default class CourseOverviewStartTrackButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  @action
  handleClicked() {
    if (this.currentUserIsAnonymous) {
      this.authenticator.initiateLogin(null);
    } else {
      this.router.transitionTo('course', this.args.courses[0]!.slug, { queryParams: { track: this.args.language.slug } });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::StartTrackButton': typeof CourseOverviewStartTrackButtonComponent;
  }
}
