import Component from '@glimmer/component';
import TrackLeaderboardEntry from 'codecrafters-frontend/utils/track-leaderboard-entry';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LanguageModel from 'codecrafters-frontend/models/language';
import type Store from '@ember-data/store';
import type TrackLeaderboardEntryModel from 'codecrafters-frontend/models/track-leaderboard-entry';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type CourseStageCompletionModel from 'codecrafters-frontend/models/course-stage-completion';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    language: LanguageModel;
  };
}

export default class TrackLeaderboardComponent extends Component<Signature> {
  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked entriesFromAPI?: TrackLeaderboardEntryModel[];
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;

  get currentUser() {
    return this.authenticator.currentUser;
  }

  get entries() {
    if (this.isLoadingEntries) {
      return [];
    }

    let entries: TrackLeaderboardEntryModel[] = [];

    if (this.entriesFromCurrentUser.length > 0) {
      entries = entries.concat(this.entriesFromAPI!.toArray().filter((entry) => entry.user !== this.currentUser));
    } else {
      entries = entries.concat(this.entriesFromAPI!.toArray());
    }

    return entries.concat(this.entriesFromCurrentUser);
  }

  get entriesFromCurrentUser() {
    if (!this.currentUser) {
      return [];
    }

    const currentUserRepositories = this.currentUser.repositories
      .filterBy('language', this.args.language)
      .filterBy('firstSubmissionCreated') as RepositoryModel[];

    if (currentUserRepositories.length === 0) {
      return [];
    }

    const completedStagesCount = currentUserRepositories.reduce((result: CourseStageCompletionModel[], repository) => {
      return result.concat(repository.courseStageCompletions.toArray()).uniqBy('courseStage');
    }, [] as CourseStageCompletionModel[]).length;

    return [
      // TODO: Move to generic interface that handles TrackLeaderboardEntry & TrackLeaderboardEntryModel
      new TrackLeaderboardEntry({
        completedStagesCount: completedStagesCount,
        language: this.args.language,
        user: this.currentUser,
      }) as unknown as TrackLeaderboardEntryModel,
    ];
  }

  get sortedEntries() {
    return this.entries.sortBy('completedStagesCount').reverse();
  }

  @action
  async handleDidInsert() {
    this.entriesFromAPI = (await this.store.query('track-leaderboard-entry', {
      language_id: this.args.language.id,
      include: 'language,user',
    })) as unknown as TrackLeaderboardEntryModel[];

    this.isLoadingEntries = false;
  }

  // eslint-disable-next-line require-yield
  *listTransition({
    insertedSprites,
    keptSprites,
    removedSprites,
  }: {
    insertedSprites: unknown[];
    keptSprites: unknown[];
    removedSprites: unknown[];
  }) {
    for (const sprite of keptSprites) {
      move(sprite);
    }

    for (const sprite of insertedSprites) {
      fadeIn(sprite);
    }

    for (const sprite of removedSprites) {
      fadeOut(sprite);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    TrackLeaderboard: typeof TrackLeaderboardComponent;
  }
}
