import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import LanguageModel from 'codecrafters-frontend/models/language';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type { BaseButtonSignature } from '../base-button';

interface Signature {
  Element: HTMLButtonElement;

  Args: {
    courses: CourseModel[];
    language: LanguageModel;
    size?: BaseButtonSignature['Args']['size'];
  };
}

export default class CourseOverviewResumeTrackButtonComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  get activeCourse() {
    if (!this.authenticator.currentUser) {
      return null;
    }

    return this.args.courses.find((course) => {
      const courseRepositories = this.authenticator
        .currentUser!.repositories.filterBy('course', course)
        .filterBy('language', this.args.language) as RepositoryModel[];

      return courseRepositories.length > 0 && !courseRepositories.some((repository) => repository.allStagesAreComplete);
    });
  }

  @action
  handleClicked() {
    this.router.transitionTo('course', (this.activeCourse || this.args.courses.reverse()[0]!).slug, {
      queryParams: { track: this.args.language.slug },
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::ResumeTrackButton': typeof CourseOverviewResumeTrackButtonComponent;
  }
}
