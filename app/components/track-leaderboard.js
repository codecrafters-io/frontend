import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import TrackLeaderboardEntry from '../lib/track-leaderboard-entry';
import rippleSpinnerImage from '/assets/images/icons/ripple-spinner.svg';

export default class TrackLeaderboardComponent extends Component {
  rippleSpinnerImage = rippleSpinnerImage;

  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked entriesFromAPI;
  @service authenticator;
  @service store;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get entries() {
    if (this.isLoadingEntries) {
      return [];
    }

    let entries = [];

    if (this.entriesFromCurrentUser.length > 0) {
      entries = entries.concat(this.entriesFromAPI.toArray().filter((entry) => entry.user !== this.currentUser));
    } else {
      entries = entries.concat(this.entriesFromAPI.toArray());
    }

    return entries.concat(this.entriesFromCurrentUser);
  }

  get entriesFromCurrentUser() {
    if (!this.currentUser) {
      return [];
    }

    let currentUserRepositories = this.currentUser.repositories.filterBy('language', this.args.language).filterBy('firstSubmissionCreated');

    if (currentUserRepositories.length === 0) {
      return [];
    }

    let completedStagesCount = currentUserRepositories.reduce((result, repository) => {
      return result.concat(repository.courseStageCompletions.toArray()).uniqBy('courseStage');
    }, []).length;

    return [
      new TrackLeaderboardEntry({
        completedStagesCount: completedStagesCount,
        language: this.args.language,
        user: this.currentUser,
      }),
    ];
  }

  @action
  async handleDidInsert() {
    this.entriesFromAPI = await this.store.query('track-leaderboard-entry', {
      language_id: this.args.language.id,
      include: 'language,user',
    });

    this.isLoadingEntries = false;
  }

  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites, keptSprites, removedSprites }) {
    for (let sprite of keptSprites) {
      move(sprite);
    }

    for (let sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (let sprite of removedSprites) {
      fadeOut(sprite);
    }
  }

  get sortedEntries() {
    return this.entries.sortBy('completedStagesCount').reverse();
  }
}
