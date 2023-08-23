import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import airpodsImage from '/assets/images/monthly-challenges/airpods.png';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: {
      id: number,
    },
  };
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;

  airpodsImage = airpodsImage;

  @action
  handleClick() {
    this.analyticsEventTracker.track('clicked_monthly_challenge_banner', {
      course_id: this.args.course.id,
    });
  }
}
