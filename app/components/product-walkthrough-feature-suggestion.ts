import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import Component from '@glimmer/component';
import type FeatureSuggestionModel from 'codecrafters-frontend/models/feature-suggestion';
import type RouterService from '@ember/routing/router-service';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export type Signature = {
  Element: HTMLDivElement;

  Args: {
    featureSuggestion?: FeatureSuggestionModel;
  };
};

export default class ProductWalkthroughFeatureSuggestion extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare router: RouterService;

  @tracked currentOrPreviouslyShownFeatureSuggestion: FeatureSuggestionModel | undefined;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);

    // Cache, since the arg will disappear after we update the dismissedAt value
    this.currentOrPreviouslyShownFeatureSuggestion = this.args.featureSuggestion;
  }

  get isDismissable() {
    return !!this.args.featureSuggestion;
  }

  @action
  async handleDismissButtonClick() {
    if (this.isDismissable && this.currentOrPreviouslyShownFeatureSuggestion) {
      this.currentOrPreviouslyShownFeatureSuggestion.dismissedAt = new Date();
      await this.currentOrPreviouslyShownFeatureSuggestion.save();
    }
  }

  @action
  async handleViewWalkthroughButtonClick() {
    if (this.currentOrPreviouslyShownFeatureSuggestion) {
      this.analyticsEventTracker.track('clicked_feature_suggestion', {
        feature_suggestion_id: this.currentOrPreviouslyShownFeatureSuggestion.id,
      });
    }

    this.router.transitionTo('concept', 'overview');
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    ProductWalkthroughFeatureSuggestion: typeof ProductWalkthroughFeatureSuggestion;
  }
}
