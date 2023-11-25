import Component from '@glimmer/component';
import LeaderboardEntry from '../lib/leaderboard-entry';
import LeaderboardPoller from 'codecrafters-frontend/lib/leaderboard-poller';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import { action } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type { TemporaryCourseModel, TemporaryRepositoryModel } from 'codecrafters-frontend/lib/temporary-types';
import type VisibilityService from 'codecrafters-frontend/services/visibility';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeRepository: TemporaryRepositoryModel;
    course: TemporaryCourseModel;
    isCollapsed: boolean;
    repositories: TemporaryRepositoryModel[];
    shouldShowLanguageIconsWithoutHover?: boolean;
  };
}

export default class CourseLeaderboardComponent extends Component<Signature> {
  transition = fade;

  leaderboardPoller: LeaderboardPoller | null = null;

  @tracked isLoadingEntries = true;
  @tracked isReloadingEntries = false;
  @tracked entriesFromAPI: LeaderboardEntry[] = [];
  @tracked polledCourse?: TemporaryCourseModel;
  @tracked team?: TeamModel;

  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare authenticator: AuthenticatorService;
  @service declare store: Store;
  @service declare visibility: VisibilityService;

  constructor(owner: unknown, args: Signature['Args']) {
    super(owner, args);
    this.team = this.currentUserIsTeamMember ? this.currentUserTeams.firstObject : undefined;
  }

  get currentUserIsTeamMember() {
    return this.authenticator.currentUserIsLoaded && !!this.currentUserTeams.firstObject;
  }

  get currentUserTeams() {
    if (this.authenticator.currentUserIsLoaded) {
      return this.authenticator.currentUser!.teams;
    } else {
      return [];
    }
  }

  get entries() {
    if (this.isLoadingEntries) {
      return [];
    }

    let entries: LeaderboardEntry[] = [];

    if (this.entriesFromCurrentUser.length > 0) {
      entries = entries.concat(this.entriesFromAPI.toArray().filter((entry) => entry.user !== this.authenticator.currentUser));
    } else {
      entries = entries.concat(this.entriesFromAPI.toArray());
    }

    return entries.concat(this.entriesFromCurrentUser);
  }

  get entriesFromCurrentUser() {
    if (this.args.repositories.length === 0 || this.args.activeRepository.isNew) {
      return [];
    }

    const allRepositories = this.args.repositories.toArray().concat([this.args.activeRepository]).uniq();

    return allRepositories.map((repository) => {
      // TODO: Use "completed stages count" instead?
      return new LeaderboardEntry({
        status: repository.lastSubmissionIsEvaluating ? 'evaluating' : repository.allStagesAreComplete ? 'completed' : 'idle',
        currentCourseStage: repository.currentStage || repository.course.firstStage,
        language: repository.language,
        user: repository.user,
        lastAttemptAt: repository.lastSubmissionAt || repository.createdAt,
      });
    });
  }

  get mergedEntries() {
    const entriesGroupedByUser: Record<string, LeaderboardEntry[]> = {};

    this.entries.forEach((entry) => {
      entriesGroupedByUser[entry.user.id] ||= [];
      entriesGroupedByUser[entry.user.id]!.push(entry);
    });

    const result = [];

    for (const entriesForUser of Object.values(entriesGroupedByUser)) {
      const entryWithHighestCourseStage = entriesForUser.sortBy('completedStagesCount', 'lastSubmissionAt').lastObject;

      result.push(
        new LeaderboardEntry({
          status: entriesForUser.isAny('status', 'evaluating') ? 'evaluating' : entryWithHighestCourseStage!.status,
          currentCourseStage: entryWithHighestCourseStage!.currentCourseStage,
          language: entryWithHighestCourseStage!.language,
          user: entryWithHighestCourseStage!.user,
          lastAttemptAt: entryWithHighestCourseStage!.lastAttemptAt,
        }),
      );
    }

    return result.sortBy('completedStagesCount', 'lastAttemptAt').reverse();
  }

  @action
  async handleDidInsert() {
    this.isLoadingEntries = false;
    this.isReloadingEntries = false;
    this.startLeaderboardPoller();
  }

  @action
  async handlePoll(entriesFromAPI: LeaderboardEntry[]) {
    this.entriesFromAPI = entriesFromAPI;
  }

  @action
  async handleTeamChange(team: TeamModel | null) {
    this.stopLeaderboardPoller();

    this.team = team || undefined;
    // this.entriesFromAPI = [];
    this.isReloadingEntries = true;

    this.handleDidInsert(); // start all over again
  }

  @action
  async handleWillDestroy() {
    this.stopLeaderboardPoller();
  }

  // @ts-expect-error ember-animated not typed
  // eslint-disable-next-line require-yield
  *listTransition({ insertedSprites, keptSprites, removedSprites }) {
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

  startLeaderboardPoller() {
    this.stopLeaderboardPoller();

    if (this.authenticator.isAnonymous) {
      return;
    }

    this.leaderboardPoller = new LeaderboardPoller({
      store: this.store,
      visibilityService: this.visibility,
      actionCableConsumerService: this.actionCableConsumer,
    });

    this.leaderboardPoller.team = this.team;
    // @ts-expect-error poll handler not typed
    this.leaderboardPoller.start(this.args.course, this.handlePoll, 'CourseLeaderboardChannel', { course_id: this.args.course.id });
    this.polledCourse = this.args.course;
  }

  stopLeaderboardPoller() {
    if (this.leaderboardPoller) {
      this.leaderboardPoller.stop();
    }

    this.polledCourse = undefined;
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseLeaderboard: typeof CourseLeaderboardComponent;
  }
}
