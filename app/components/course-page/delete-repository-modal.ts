import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import window from 'ember-window-mock';
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
  @service router!: RouterService;
  @service store!: Store;

  @action
  async deleteRepository() {
    if (!this.args.repository) {
      return;
    }

    this.router.transitionTo('catalog');
    await this.args.repository.destroyRecord();
    window.location.reload();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DeleteRepositoryModal: typeof DeleteRepositoryModalComponent;
  }
}
