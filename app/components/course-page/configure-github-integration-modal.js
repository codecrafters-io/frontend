import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class ConfigureGithubIntegrationModalComponent extends Component {
  @service('current-user') currentUserService;
  @service store;

  @tracked isLoading = true;

  constructor() {
    super(...arguments);
    this.loadResources();
  }

  @action
  async loadResources() {
    await this.store.findAll('github-app-installation', { include: 'user' });
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
}
