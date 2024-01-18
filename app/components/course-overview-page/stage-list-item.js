import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewPageStageListItemComponent extends Component {
  @service authenticator;
  @service store;

  get recentlyAttemptedUsers() {
    return this.store
      .peekAll('course-leaderboard-entry')
      .filter((entry) => entry.currentCourseStage.position >= this.args.stage.position)
      .sortBy('currentCourseStage.position')
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }

  get userHasStartedCourse() {
    return this.authenticator.currentUser && this.authenticator.currentUser.repositories.filterBy('course', this.args.course)[0];
  }
}
