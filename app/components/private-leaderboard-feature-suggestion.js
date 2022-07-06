import { htmlSafe } from '@ember/template';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class PrivateLeaderboardFeatureSuggestion extends Component {
  async handleDismissButtonClick() {
    this.args.featureSuggestion.dismissedAt = new Date();
    await this.args.featureSuggestion.dismiss();
  }
}
