import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import fade from 'ember-animated/transitions/fade';
import type RouterService from '@ember/routing/router-service';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type RepositoryModel from 'codecrafters-frontend/models/repository';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    repositories: RepositoryModel[];
    activeRepository: RepositoryModel;
  };

  Blocks: {
    default: [];
  };
}

export default class CoursePageRepositoryDropdownComponent extends Component<Signature> {
  transition = fade;

  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked gitRepositoryURLWasCopiedRecently: boolean = false;
  @tracked configureGithubIntegrationModalIsOpen: boolean = false;
  @tracked deleteRepositoryModalIsOpen: boolean = false;
  @tracked progressBannerModalIsOpen: boolean = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get nonActiveRepositories() {
    return this.args.repositories.filter((repository) => repository !== this.args.activeRepository);
  }

  @action
  async handleCopyGifBannerButtonClick(dropdownActions: { close: () => void }) {
    // get('isNew') works around type bug
    if (this.args.activeRepository.get('isNew')) {
      return;
    }

    dropdownActions.close();
    this.progressBannerModalIsOpen = true;
  }

  @action
  async handleCopyGitRepositoryURLClick() {
    // get('isNew') works around type bug
    if (this.args.activeRepository.get('isNew')) {
      return;
    }

    await navigator.clipboard.writeText(this.args.activeRepository.cloneUrl);
    this.gitRepositoryURLWasCopiedRecently = true;

    later(
      this,
      () => {
        this.gitRepositoryURLWasCopiedRecently = false;
      },
      1000,
    );
  }

  @action
  async handleDeleteRepositoryActionClick(dropdownActions: { close: () => void }) {
    this.deleteRepositoryModalIsOpen = true;
    dropdownActions.close();
  }

  @action
  async handlePublishToGithubButtonClick(dropdownActions: { close: () => void }) {
    // get('isNew') works around type bug
    if (this.args.activeRepository.get('isNew')) {
      return;
    }

    this.configureGithubIntegrationModalIsOpen = true;
    dropdownActions.close();
  }

  @action
  async handleRepositoryLinkClick(repository: RepositoryModel, dropdownActions: { close: () => void }) {
    // TODO: Even though we're using replaceWith, this does seem to cause a history entry to be added. Debug why?
    await this.router.replaceWith('course', repository.course.slug, { queryParams: { repo: repository.id } }).followRedirects();
    dropdownActions.close();
  }

  @action
  async handleRetryWithSameLanguageActionClick(dropdownActions: { close: () => void }) {
    this.router
      .transitionTo('course.introduction', { queryParams: { repo: 'new', track: this.args.activeRepository.language!.slug } })
      .followRedirects();

    dropdownActions.close();
  }

  @action
  async handleTryDifferentLanguageActionClick(dropdownActions: { close: () => void }) {
    this.router.transitionTo('course.introduction', { queryParams: { repo: 'new', track: null } });
    dropdownActions.close();
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::RepositoryDropdown': typeof CoursePageRepositoryDropdownComponent;
  }
}
