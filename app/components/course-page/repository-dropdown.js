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

  get currentUser() {
    return this.authenticator.currentUser;
  }

  @action
  async handleCopyGifBannerButtonClick(dropdownActions) {
    if (this.args.activeRepository.isNew) {
      return;
    }

    dropdownActions.close();
    this.args.onViewProgressBannerButtonClick();
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
      1000
    );
  }

  @action
  async handlePublishToGithubButtonClick(dropdownActions) {
    if (this.args.activeRepository.isNew) {
      return;
    }

    this.args.onPublishToGithubButtonClick();
    dropdownActions.close();
  }

  @action
  async handleRepositoryLinkClick(repository, dropdownActions) {
    await this.router.transitionTo('course', repository.course.get('slug'), { queryParams: { repo: repository.id, track: null } });
    dropdownActions.close();
  }

  @action
  async handleRetryWithSameLanguageActionClick(dropdownActions) {
    await this.router.transitionTo({ queryParams: { fresh: true, repo: null, track: this.args.activeRepository.get('language.slug') } });
    dropdownActions.close();
  }

  @action
  async handleTryDifferentLanguageActionClick(dropdownActions) {
    await this.router.transitionTo({ queryParams: { fresh: true, repo: null, track: null } });
    dropdownActions.close();
  }

  get nonActiveRepositories() {
    return this.args.repositories.reject((repository) => repository === this.args.activeRepository);
  }
}
