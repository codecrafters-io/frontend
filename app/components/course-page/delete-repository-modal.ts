import Component from '@glimmer/component';
import RepositoryModel from 'codecrafters-frontend/models/repository';
import RouterService from '@ember/routing/router-service';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    onClose?: () => void;
    repository: RepositoryModel;
  };
}

export default class DeleteRepositoryModalComponent extends Component<Signature> {
  @tracked isDeleting: boolean = false;

  @service declare router: RouterService;
  @service declare store: Store;

  @action
  async deleteRepository() {
    if (!this.args.repository) {
      return;
    }

    if (this.isDeleting) {
      return;
    }

    this.isDeleting = true;

    const trackSlug = this.args.repository.language?.slug; // Store this before we destroy the record
    await this.args.repository.destroyRecord(); // TODO: Add failure handling
    this.router.transitionTo('course.introduction', { queryParams: { repo: 'new', track: trackSlug } }).followRedirects();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    DeleteRepositoryModal: typeof DeleteRepositoryModalComponent;
  }
}
