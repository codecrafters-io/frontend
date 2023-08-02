import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class PrivateLeaderboardFeatureSuggestion extends Component {
  @service analyticsEventTracker;
  @service router;

  constructor() {
    super(...arguments);

    // Cache, since the arg will disappear after we update the dismissedAt value
    this.currentOrPreviouslyShownFeatureSuggestion = this.args.featureSuggestion;
  }

  @action
  async handleCreateTeamButtonClick() {
    this.analyticsEventTracker.track('clicked_feature_suggestion', {
      feature_suggestion_id: this.currentOrPreviouslyShownFeatureSuggestion.id,
    });

    this.router.transitionTo('teams.create');
  }

  @action
  async handleDismissButtonClick() {
    this.currentOrPreviouslyShownFeatureSuggestion.dismissedAt = new Date();
    await this.currentOrPreviouslyShownFeatureSuggestion.save();
  }
}
