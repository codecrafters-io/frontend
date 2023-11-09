import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import congratulationsImage from '/assets/images/icons/congratulations.png';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/lib/temporary-types';

type Signature = {
  Element: HTMLDivElement;

  Args: {
    repository: TemporaryRepositoryModel;
  };
};

export default class BaseStagesCompletedCardComponent extends Component<Signature> {
  congratulationsImage = congratulationsImage;

  @tracked configureExtensionsModalIsOpen = false;
}
