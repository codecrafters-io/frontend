import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CourseOverviewPageStageListItemComponent extends Component {
  @service authenticator;
  @service store;

  get marketingHTML() {
    return htmlSafe(new showdown.Converter({ openLinksInNewWindow: true }).makeHtml(this.args.stage.marketingMarkdown));
  }

  get userHasStartedCourse() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('course', this.args.course).firstObject;
  }

  get recentlyAttemptedUsers() {
    return this.store
      .peekAll('leaderboard-entry')
      .filter((entry) => entry.currentCourseStage.position >= this.args.stage.position)
      .sortBy('currentCourseStage.position')
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}
