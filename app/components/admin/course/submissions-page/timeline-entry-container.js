import Component from '@glimmer/component';

export default class AdminCourseSubmissionsPageTimelineEntryContainerComponent extends Component {
  get formattedTimestamp() {
    return this.timestamp.toLocaleTimeString('en-US').toLowerCase();
  }

  get timestamp() {
    return this.args.submission.createdAt;
  }
}
