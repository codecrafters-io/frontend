import Component from '@glimmer/component';
import type { Signature as UpgradePromptSignature } from './course-page/course-stage-step/upgrade-prompt';
import { action } from '@ember/object';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import { service } from '@ember/service';

interface Signature {
  Element: HTMLDivElement;

  Args: UpgradePromptSignature['Args'] & {
    onClose: () => void;
  };
}

export default class UpgradeModalComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @action
  handleDidInsert() {
    this.analyticsEventTracker.track('viewed_upgrade_prompt', {
      feature_slug: this.args.featureSlugToHighlight,
    });
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    UpgradeModal: typeof UpgradeModalComponent;
  }
}
