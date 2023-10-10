import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose?: () => void;
    repository: RepositoryModel;
  };
}

export default class DeleteRepositoryModalComponent extends Component<Signature> {
  @service declare router: RouterService;

  @action
  async deleteRepository() {
    if (!this.args.repository) {
      return;
    }

    this.router.transitionTo('catalog');
    await this.args.repository.destroyRecord();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DeleteRepositoryModal: typeof DeleteRepositoryModalComponent;
  }
}
