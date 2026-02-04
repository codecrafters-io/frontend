import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Args: {
    repository: RepositoryModel;
    recommendedRepositoryName: string;
    recommendedRepositoryNameWithoutOwner: string;
  };
}

export default class CreateGithubRepositoryStep extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::ConfigureGithubIntegrationModal::CreateGithubRepositoryStep': typeof CreateGithubRepositoryStep;
  }
}
