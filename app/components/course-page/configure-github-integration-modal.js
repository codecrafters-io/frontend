import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { partition } from 'codecrafters-frontend/lib/lodash-utils';
import { tracked } from '@glimmer/tracking';

export default class ConfigureGithubIntegrationModalComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  @tracked isLoading = true;
  @tracked isCreatingGithubRepositorySyncConfiguration = false;
  @tracked accessibleRepositories = [];
  @tracked selectedRepository = null;

  constructor() {
    super(...arguments);
    this.loadResources();
  }

  get accessibleRepositoryGroups() {
    let [recentlyCreatedRepositories, allOtherRepositories] = partition(
      this.accessibleRepositories,
      (repository) => new Date() - repository.createdAt < 1000 * 60 * 60 // 1 hour
    );

    let groups = [];

    if (recentlyCreatedRepositories.length > 0) {
      groups.push({
        title: 'Recently created',
        repositories: recentlyCreatedRepositories.sortBy('createdAt').reverse(),
      });
    }

    if (allOtherRepositories.length > 0) {
      groups.push({
        title: 'All repositories',
        repositories: allOtherRepositories.sortBy('fullName'),
      });
    }

    return groups;
  }

  get githubRepositorySyncConfiguration() {
    return this.args.repository.githubRepositorySyncConfiguration;
  }

  @action
  async loadResources() {
    await Promise.all([
      this.store.findAll('github-repository-sync-configuration', { include: 'repository' }),
      this.store.findAll('github-app-installation', { include: 'user' }),
    ]);

    if (this.githubAppInstallation) {
      this.accessibleRepositories = await this.githubAppInstallation.fetchAccessibleRepositories();
      this.selectedRepository = this.accessibleRepositoryGroups[0].repositories[0];
    }

    this.isLoading = false;
  }

  @action
  async handleDisconnectRepositoryButtonClick() {
    await this.githubRepositorySyncConfiguration.destroyRecord();
  }

  @action
  async handleRepositoryOptionSelected(event) {
    let repositoryId = event.target.value;
    this.selectedRepository = this.accessibleRepositories.find((repository) => repository.id.toString() === repositoryId);
    console.log(repositoryId, this.selectedRepository);
  }

  @action
  handleInstallGitHubAppButtonClick() {
    window.location.href = `/github_app_installations/start?repository_id=${this.args.repository.id}`;
  }

  @action
  async handlePublishButtonClick() {
    let repositoryIsRecentlyCreated = new Date() - this.selectedRepository.createdAt < 1000 * 60 * 60;

    if (
      repositoryIsRecentlyCreated ||
      window.confirm(`Are you sure? Publishing will delete any existing contents in the ${this.selectedRepository.fullName} repository.`)
    ) {
      let githubRepositorySyncConfiguration = this.store.createRecord('github-repository-sync-configuration', {
        githubRepositoryId: this.selectedRepository.id,
        githubRepositoryName: this.selectedRepository.fullName,
        repository: this.args.repository,
      });

      this.isCreatingGithubRepositorySyncConfiguration = true;
      await githubRepositorySyncConfiguration.save();
      this.isCreatingGithubRepositorySyncConfiguration = false;
    }
  }

  get githubAppInstallation() {
    console.log(this.currentUserService.record.githubAppInstallations.length);

    return this.currentUserService.record.githubAppInstallation;
  }

  get recommendedRepositoryName() {
    return `${this.currentUserService.record.githubUsername}/codecrafters-${this.args.repository.course.slug}-${this.args.repository.language.slug}`;
  }
}
