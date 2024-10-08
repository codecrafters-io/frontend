import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repository: RepositoryModel;
  };
}

export default class BaseStagesCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureExtensionsModalIsOpen = false;
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::BaseStagesCompletedCard': typeof BaseStagesCompletedCardComponent;
  }
}
