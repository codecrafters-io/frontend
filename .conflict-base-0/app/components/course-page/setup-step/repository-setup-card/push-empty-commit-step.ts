import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    onTroubleshootingLinkClick: () => void;
  };
}

export default class PushEmptyCommitStep extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::PushEmptyCommitStep': typeof PushEmptyCommitStep;
  }
}
