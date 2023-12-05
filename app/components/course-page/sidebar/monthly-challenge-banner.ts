import AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import MonthlyChallengeBannerService from 'codecrafters-frontend/services/monthly-challenge-banner';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

interface Signature {
  Element: HTMLAnchorElement;

  Args: {
    course: CourseModel;
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

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'CoursePage::Sidebar::MonthlyChallengeBanner': typeof MonthlyChallengeBannerComponent;
  }
}
