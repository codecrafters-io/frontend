import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TrackPageCourseCardComponent extends Component {
  @service authenticator;
  @service router;
  @service store;

  get currentUserIsAnonymous() {
    return this.authenticator.isAnonymous;
  }

  get introductionMarkdown() {
    return this.args.course.trackIntroductionMarkdownFor(this.args.language);
  }

  get recentParticipants() {
    return [];
    // return this.store
    //   .peekAll('track-leaderboard-entry')
    //   .filterBy('language', this.args.language)
    //   .sortBy('completedStagesCount')
    //   .reverse()
    //   .uniqBy('user')
    //   .slice(0, 3)
    //   .mapBy('user');
  }

  @action
  handleClick() {
    this.router.transitionTo('course', this.args.course.slug, { queryParams: { track: this.args.language.slug } });
  }
}
