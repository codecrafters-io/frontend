import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ConfigureGithubIntegrationModalComponent extends Component {
  @service('current-user') currentUserService;

  @action
  handleInstallGitHubAppButtonClick() {
    window.location.href = `/github_app_installations/start?repository_id=${this.args.repository.id}`;
  }

  get recommendedRepositoryName() {
    return `${this.currentUserService.record.githubUsername}/codecrafters-${this.args.repository.course.slug}-${this.args.repository.language.slug}`;
  }
}
