import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: {
      id: number;
    };
    shouldShowMonthlyChallengeBanner: boolean;
  };
}

export default class MonthlyChallengeBannerComponent extends Component<Signature> {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare monthlyChallengeBanner: MonthlyChallengeBannerService;

  @action
  handleClick() {
    this.analyticsEventTracker.track('clicked_monthly_challenge_banner', {
      course_id: this.args.course.id,
    });
  }
}
