import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class PrivateLeaderboardFeatureSuggestion extends Component {
  constructor() {
    super(...arguments);

    // Cache, since the arg will disappear after we update the dismissedAt value
    this.currentOrPreviouslyShownFeatureSuggestion = this.args.featureSuggestion;
  }

  @action
  async handleDismissButtonClick() {
    this.currentOrPreviouslyShownFeatureSuggestion.dismissedAt = new Date();
    await this.currentOrPreviouslyShownFeatureSuggestion.save();
  }
}
