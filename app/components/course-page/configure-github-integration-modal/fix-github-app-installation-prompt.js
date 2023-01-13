import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class FixGithubAppInstallationPromptComponent extends Component {
  @tracked isRefreshing = false;
  @service store;

  @action
  async handleRefreshStatusButtonClick() {
    this.isRefreshing = true;
    await this.store.findRecord('github-app-installation', this.args.githubAppInstallation.id);
    this.isRefreshing = false;

    this.args.onStatusRefresh();
  }
}
