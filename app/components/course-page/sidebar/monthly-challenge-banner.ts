import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import opalC1Image from '/assets/images/monthly-challenges/opal-c1.png';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: {
      id: number;
    };
  };
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  opalC1Image = opalC1Image;

  @action
  handleClick() {
    this.analyticsEventTracker.track('clicked_monthly_challenge_banner', {
      course_id: this.args.course.id,
    });
  }
}
