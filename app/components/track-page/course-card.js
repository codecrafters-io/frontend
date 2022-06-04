import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class TrackPageCourseCardComponent extends Component {
  @service currentUser;
  @service router;
  @service store;

  get currentUserIsAnonymous() {
    return this.currentUser.isAnonymous;
  }

  @action
  handleClick() {
    this.router.transitionTo('course', this.args.course.slug, { queryParams: { track: this.args.language.slug } });
  }

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
}
