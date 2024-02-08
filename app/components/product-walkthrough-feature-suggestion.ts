import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    featureSuggestion: FeatureSuggestionModel;
  };
};

export default class ProductWalkthroughFeatureSuggestion extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare router: RouterService;

  @tracked currentOrPreviouslyShownFeatureSuggestion: FeatureSuggestionModel;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    // Cache, since the arg will disappear after we update the dismissedAt value
    this.currentOrPreviouslyShownFeatureSuggestion = this.args.featureSuggestion;
  }

  @action
  async handleDismissButtonClick() {
    this.currentOrPreviouslyShownFeatureSuggestion.dismissedAt = new Date();
    await this.currentOrPreviouslyShownFeatureSuggestion.save();
  }

  @action
  async handleViewWalkthroughButtonClick() {
    this.analyticsEventTracker.track('clicked_feature_suggestion', {
      feature_suggestion_id: this.currentOrPreviouslyShownFeatureSuggestion.id,
    });

    this.router.transitionTo('concept', 'overview');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ProductWalkthroughFeatureSuggestion: typeof ProductWalkthroughFeatureSuggestion;
  }
}
