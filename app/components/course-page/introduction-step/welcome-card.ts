import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class WelcomeCardComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::IntroductionStep::WelcomeCard': typeof WelcomeCardComponent;
  }
}
