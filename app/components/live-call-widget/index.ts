import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import type LiveCallWidgetService from 'codecrafters-frontend/services/live-call-widget';

export default class LiveCallWidgetComponent extends Component {
  @service declare liveCallWidget: LiveCallWidgetService;

  get hostInitial(): string {
    return this.liveCallWidget.displayData?.host_name?.charAt(0)?.toUpperCase() ?? '?';
  }

  @action
  openMeetLink(): void {
    const meetLink = this.liveCallWidget.displayData?.meet_link;

    if (meetLink) {
      window.open(meetLink, '_blank');
    }
  }
}
