import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';

export default class ConfigureGithubIntegrationModalComponent extends Component {
  @action
  handleInstallGitHubAppButtonClick() {
    window.location.href = `/github_app_installations/start?repository_id=${this.args.repository.id}`;
  }
}
