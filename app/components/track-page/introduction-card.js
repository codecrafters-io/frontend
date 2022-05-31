import Component from '@glimmer/component';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import showdown from 'showdown';

export default class CourseOverviewPageIntroductionAndStagesComponent extends Component {
  @service store;

  get introductionHtml() {
    return htmlSafe(new showdown.Converter().makeHtml(this.args.language.trackIntroductionMarkdown));
  }

  get recentParticipants() {
    return this.store
      .peekAll('leaderboard-entry')
      .filterBy('language', this.args.language)
      .sortBy('currentCourseStage.position')
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}
