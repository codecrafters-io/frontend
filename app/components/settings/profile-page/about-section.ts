import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import type UserModel from 'codecrafters-frontend/models/user';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    user: UserModel;
  };
}

export default class AboutSectionComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  @tracked isUpdating = false;
  @tracked wasUpdatedRecently = false;

  @action
  async handleBlur() {
    this.updateValue.perform();

    if (!this.wasUpdatedRecently) {
      this.analyticsEventTracker.track('updated_profile_description', {});
    }
  }

  updateValue = task({ keepLatest: true }, async (): Promise<void> => {
    this.isUpdating = true;
    this.wasUpdatedRecently = false;

    try {
      await this.args.user.save();
    } catch (e) {
      console.error(e);

      // TODO: Handle error state?

      return;
    }

    this.isUpdating = false;
    this.wasUpdatedRecently = true;
    await timeout(1000);
    this.wasUpdatedRecently = false;
  });
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'Settings::ProfilePage::AboutSection': typeof AboutSectionComponent;
  }
}
