import Component from '@glimmer/component';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
    isComplete: boolean;
  };
};

export default class CloneRepositoryStepComponent extends Component<Signature> {}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::SetupStep::RepositorySetupCard::CloneRepositoryStep': typeof CloneRepositoryStepComponent;
  }
}
