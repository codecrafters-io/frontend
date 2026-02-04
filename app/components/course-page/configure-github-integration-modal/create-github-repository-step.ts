import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    recommendedRepositoryName: string;
    recommendedRepositoryNameWithoutOwner: string;
    repository: RepositoryModel;
  };
}

export default class CreateGithubRepositoryStep extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureGithubIntegrationModal::CreateGithubRepositoryStep': typeof CreateGithubRepositoryStep;
  }
}
