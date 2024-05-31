import Component from '@glimmer/component';
import Store from '@ember-data/store';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type CourseModel from 'codecrafters-frontend/models/course';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type CourseStageModel from 'codecrafters-frontend/models/course-stage';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    course: CourseModel;
    activeRepository?: RepositoryModel;
    language: LanguageModel;
  };
};

export default class CourseCardComponent extends Component<Signature> {
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;
  @service declare store: Store;

  get completedStages(): CourseStageModel[] {
    if (this.args.activeRepository) {
      return this.args.activeRepository.completedStages;
    } else {
      return [];
    }
  }

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get introductionMarkdown() {
    return this.args.course.trackIntroductionMarkdownFor(this.args.language);
  }

  get recentParticipants() {
    return [];
  }

  @action
  handleClick() {
    this.router.transitionTo('course', this.args.course.slug, { queryParams: { track: this.args.language.slug } });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'TrackPage::CourseCard': typeof CourseCardComponent;
  }
}
