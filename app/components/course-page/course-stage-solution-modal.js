import Component from '@glimmer/component';

import { action } from '@ember/object';

export default class CourseStageSolutionModalComponent extends Component {
  constructor() {
    super(...arguments);

    this.emitAnalyticsEvent();
  }

  emitAnalyticsEvent() {
    if (this.activeTab === 'comments') {
      this.analyticsEventTracker.track('viewed_course_stage_comments', {
        course_slug: this.courseStage.course.slug,
        course_stage_slug: this.courseStage.slug,
      });
    } else if (this.activeTab === 'screencasts') {
      this.analyticsEventTracker.track('viewed_screencast_list', { course_stage_id: this.courseStage.id });
    }
  }

  @action
  handleCourseStageUpdated() {
    if (!this.tabIsAvailable(this.activeTab)) {
      this.activeTab = this.availableTabs[0];
    }
  }

  @action
  handleTabLinkClick(tab) {
    this.activeTab = tab;
    this.emitAnalyticsEvent();
  }
}
