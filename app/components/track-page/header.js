import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackPageHeaderComponent extends Component {
  @service store;

  get recentParticipants() {
    return this.store
      .peekAll('leaderboard-entry')
      .filterBy('language', this.args.language)
      .sortBy('currentCourseStage.position')
      .reverse()
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}
