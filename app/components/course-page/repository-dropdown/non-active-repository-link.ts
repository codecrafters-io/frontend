import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };

  Blocks: {
    default: [];
  };
}

export default class NonActiveRepositoryLinkComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::RepositoryDropdown::NonActiveRepositoryLink': typeof NonActiveRepositoryLinkComponent;
  }
}
