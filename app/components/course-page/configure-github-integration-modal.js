import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { partition } from 'codecrafters-frontend/lib/lodash-utils';

export default class ConfigureGithubIntegrationModalComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  @tracked isLoading = true;
  @tracked accessibleRepositories = [];
  @tracked selectedRepository = [];

  constructor() {
    super(...arguments);
    this.loadResources();
  }

  @action
  async loadResources() {
    await this.store.findAll('github-app-installation', { include: 'user' });

    if (this.githubAppInstallation) {
      this.accessibleRepositories = await this.githubAppInstallation.fetchAccessibleRepositories();
      console.log(this.accessibleRepositories);
    }

    this.isLoading = false;
  }

  @action
  handleInstallGitHubAppButtonClick() {
    window.location.href = `/github_app_installations/start?repository_id=${this.args.repository.id}`;
  }

  get githubAppInstallation() {
    console.log(this.currentUserService.record.githubAppInstallations.length);

    return this.currentUserService.record.githubAppInstallation;
  }

  get recommendedRepositoryName() {
    return `${this.currentUserService.record.githubUsername}/codecrafters-${this.args.repository.course.slug}-${this.args.repository.language.slug}`;
  }

  get accessibleRepositoryGroups() {
    let [recentlyCreatedRepositories, allOtherRepositories] = partition(
      this.accessibleRepositories,
      (repository) => repository.createdAt - new Date() < 1000 * 60 * 60 // 1 hour
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
        title: 'All other repositories',
        repositories: allOtherRepositories.sortBy('fullName'),
      });
    }

    return groups;
  }
}
