import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import RouterService from '@ember/routing/router-service';
import type { BaseButtonSignature } from '../base-button';
import { action } from '@ember/object';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    courses: CourseModel[];
    language: LanguageModel;
    size?: BaseButtonSignature['Args']['size'];
  };
}

export default class CourseOverviewStartTrackButton extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @action
  handleClick() {
    if (this.authenticator.isAnonymous) {
      if (this.args.language.primerConceptGroup) {
        this.router.transitionTo('concept', this.args.language.primerConceptGroup.conceptSlugs[0]!);
      } else {
        this.authenticator.initiateLogin();
      }
    } else {
      this.router.transitionTo('course', this.args.courses[0]!.slug, { queryParams: { repo: null, track: this.args.language.slug } });
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::StartTrackButton': typeof CourseOverviewStartTrackButton;
  }
}
