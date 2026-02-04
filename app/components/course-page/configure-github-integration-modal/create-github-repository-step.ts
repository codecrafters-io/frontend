import Component from '@glimmer/component';

interface Signature {
  Element: HTMLDivElement;

  Args: {
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
