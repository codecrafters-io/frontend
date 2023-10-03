import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { later } from '@ember/runloop';
import fade from 'ember-animated/transitions/fade';

export default class CoursePageRepositoryDropdownComponent extends Component {
  transition = fade;
  @service authenticator;
  @service router;
  @tracked gitRepositoryURLWasCopiedRecently;
  @tracked configureGithubIntegrationModalIsOpen = false;
  @tracked deleteRepositoryModalIsOpen = false;
  @tracked progressBannerModalIsOpen = false;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  async handleCopyGifBannerButtonClick(dropdownActions) {
    if (this.args.activeRepository.isNew) {
      return;
    }

    dropdownActions.close();
    this.progressBannerModalIsOpen = true;
  }

  @action
  async handleCopyGitRepositoryURLClick() {
    if (this.args.activeRepository.isNew) {
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
  async handlePublishToGithubButtonClick(dropdownActions) {
    if (this.args.activeRepository.isNew) {
      return;
    }

    this.configureGithubIntegrationModalIsOpen = true;
    dropdownActions.close();
  }

  @action
  async handleRepositoryLinkClick(repository, dropdownActions) {
    // TODO: Even though we're using replaceWith, this does seem to cause a history entry to be added. Debug why?
    await this.router.replaceWith('course', repository.course.slug, { queryParams: { repo: repository.id } }).followRedirects();
    dropdownActions.close();
  }

  @action
  async handleRetryWithSameLanguageActionClick(dropdownActions) {
    this.router
      .transitionTo('course.introduction', { queryParams: { repo: 'new', track: this.args.activeRepository.language.slug } })
      .followRedirects();

    dropdownActions.close();
  }

  @action
  async handleTryDifferentLanguageActionClick(dropdownActions) {
    this.router.transitionTo('course.introduction', { queryParams: { repo: 'new', track: null } });
    dropdownActions.close();
  }

  get nonActiveRepositories() {
    return this.args.repositories.reject((repository) => repository === this.args.activeRepository);
  }
}
