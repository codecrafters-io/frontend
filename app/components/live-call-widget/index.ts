import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';

export default class LiveCallWidgetComponent extends Component {
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare liveCallWidget: LiveCallWidgetService;

  get hostInitial(): string {
    return this.liveCallWidget.displayData?.host_name?.charAt(0)?.toUpperCase() ?? '?';
  }

  @action
  openMeetLink(): void {
    const meetLink = this.liveCallWidget.displayData?.meet_link;

    if (meetLink) {
      this.analyticsEventTracker.track('clicked_live_call_widget_join', {
        host_name: this.liveCallWidget.displayData?.host_name,
        meet_link: meetLink,
      });

      window.open(meetLink, '_blank');
    }
  }
}
