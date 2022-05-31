import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class TrackPageCourseCardComponent extends Component {
  @service currentUser;
  @service store;

  get introductionHtml() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.course.trackIntroductionMarkdownFor(this.args.language)));
  }

  get recentParticipants() {
    return this.store
      .peekAll('leaderboard-entry')
      .filterBy('language', this.args.language)
      .filterBy('course', this.args.course)
      .sortBy('lastAttemptAt')
      .reverse()
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }

  get shouldMaskContents() {
    return this.currentUser.isAnonymous;
  }
}
