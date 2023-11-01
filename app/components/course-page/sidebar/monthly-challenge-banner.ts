import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import petoiRobotDogImage from '/assets/images/monthly-challenges/petoirobotdog.png';

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

  petoiRobotDogImage = petoiRobotDogImage;

  @action
  handleClick() {
    this.analyticsEventTracker.track('clicked_monthly_challenge_banner', {
      course_id: this.args.course.id,
    });
  }
}
