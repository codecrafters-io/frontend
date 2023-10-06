import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose?: () => void;
    repository?: RepositoryModel;
  };
}

export default class DeleteRepositoryModalComponent extends Component<Signature> {
  @action
  deleteRepository() {
    if (!this.args.repository) {
      return;
    }

    this.args.repository.deleteRepository({});
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DeleteRepositoryModal: typeof DeleteRepositoryModalComponent;
  }
}
