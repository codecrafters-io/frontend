import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackPageHeaderComponent extends Component {
  @service authenticator;
  @service store;

  get currentUserHasStartedTrack() {
    return this.authenticator.currentUser && this.authenticator.currentUser.repositories.filterBy('language', this.args.language)[0];
  }

  get topParticipants() {
    return this.store
      .peekAll('track-leaderboard-entry')
      .filterBy('language', this.args.language)
      .sortBy('completedStagesCount')
      .reverse()
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}
