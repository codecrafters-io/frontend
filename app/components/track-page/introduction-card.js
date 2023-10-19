import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class CourseOverviewPageIntroductionAndStagesComponent extends Component {
  @service store;

  get recentParticipants() {
    return this.store
      .peekAll('track-leaderboard-entry')
      .filterBy('language', this.args.language)
      .sortBy('completedStagesCount')
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}
