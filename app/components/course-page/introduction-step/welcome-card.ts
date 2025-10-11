import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    preferredLanguageSlug: string | undefined;
    repository: RepositoryModel;
  };
}

export default class WelcomeCard extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard': typeof WelcomeCard;
  }
}
