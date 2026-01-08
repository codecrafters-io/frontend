import Component from '@glimmer/component';
import type Owner from '@ember/owner';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseLeaderboardEntry from 'codecrafters-frontend/utils/course-leaderboard-entry';
import fade from 'ember-animated/transitions/fade';
import LeaderboardPoller from 'codecrafters-frontend/utils/leaderboard-poller';
import move from 'ember-animated/motions/move';
import config from 'codecrafters-frontend/config/environment';
import { action, get } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import fieldComparator from 'codecrafters-frontend/utils/field-comparator';
import uniqReducer from 'codecrafters-frontend/utils/uniq-reducer';
import type ActionCableConsumerService from 'codecrafters-frontend/services/action-cable-consumer';
import type AnalyticsEventTrackerService from 'codecrafters-frontend/services/analytics-event-tracker';
import type AuthenticatorService from 'codecrafters-frontend/services/authenticator';
import type LeaderboardTeamStorageService from 'codecrafters-frontend/services/leaderboard-team-storage';
import type RepositoryModel from 'codecrafters-frontend/models/repository';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import type TeamModel from 'codecrafters-frontend/models/team';
import type VisibilityService from 'codecrafters-frontend/services/visibility';

interface Signature {
  Element: HTMLDivElement;

  Args: {
    activeRepository: RepositoryModel | null;
    course: CourseModel;
    isCollapsed: boolean;
    repositories: RepositoryModel[];
    shouldShowLanguageIconsWithoutHover?: boolean;
  };
}

export default class CourseLeaderboard extends Component<Signature> {
  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare leaderboardTeamStorage: LeaderboardTeamStorageService;
  @service declare router: RouterService;
  @service declare store: Store;
  @service declare visibility: VisibilityService;

  @tracked entriesFromAPI: CourseLeaderboardEntry[] = [];
  @tracked isLoadingEntries = true;
  @tracked isReloadingEntries = false;
  @tracked team: TeamModel | null = null;

  transition = fade;

  constructor(owner: Owner, args: Signature['Args']) {
    super(owner, args);

    if (this.leaderboardTeamStorage.lastSelectionWasGlobalLeaderboard) {
      this.team = null;
    } else {
      const defaultTeam = this.currentUserTeams[0] ?? null;
      const lastSelectedTeamId = this.leaderboardTeamStorage.lastSelectedTeamId;
      this.team = this.currentUserTeams.find((team) => team.id === lastSelectedTeamId) ?? defaultTeam;
    }
  }

  get currentUserIsTeamMember() {
    return this.authenticator.currentUserIsLoaded && !!this.currentUserTeams[0];
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

    let entries: CourseLeaderboardEntry[] = [];

    if (this.entriesFromCurrentUser.length > 0) {
      entries = entries.concat(this.entriesFromAPI.filter((entry) => entry.user !== this.authenticator.currentUser));
    } else {
      entries = entries.concat(this.entriesFromAPI);
    }

    return entries.concat(this.entriesFromCurrentUser);
  }

  get entriesFromCurrentUser() {
    // We're using the get helper instead of model.isNew because of a typescript error.
    // An issue is opened here: https://github.com/emberjs/data/issues/9146.
    // eslint-disable-next-line ember/no-get
    if (this.args.repositories.length === 0 || get(this.args.activeRepository, 'isNew')) {
      return [];
    }

    const allRepositories = [...this.args.repositories];

    if (this.args.activeRepository) {
      allRepositories.push(this.args.activeRepository);
    }

    return allRepositories.reduce(uniqReducer(), []).map((repository) => {
      return new CourseLeaderboardEntry({
        status: repository.lastSubmissionIsEvaluating ? 'evaluating' : repository.allStagesAreComplete ? 'completed' : 'idle',
        completedStageSlugs: repository.completedStageSlugs,
        currentCourseStage: repository.currentStage || repository.course.firstStage,
        language: repository.language,
        user: repository.user,
        lastAttemptAt: repository.lastSubmissionAt || repository.createdAt,
      });
    });
  }

  get inviteButtonText() {
    if (this.team) {
      return 'Invite a teammate';
    } else {
      return 'Invite a friend';
    }
  }

  get mergedEntries() {
    const entriesGroupedByUser: Record<string, CourseLeaderboardEntry[]> = {};

    this.entries.forEach((entry) => {
      entriesGroupedByUser[entry.user.id] ||= [];
      entriesGroupedByUser[entry.user.id]!.push(entry);
    });

    const result = [];

    for (const entriesForUser of Object.values(entriesGroupedByUser)) {
      const entryWithMostStageCompletions = entriesForUser.toSorted(fieldComparator('completedStagesCount', 'lastAttemptAt')).at(-1);

      result.push(
        new CourseLeaderboardEntry({
          status: entriesForUser.some((item) => item.status === 'evaluating') ? 'evaluating' : entryWithMostStageCompletions!.status,
          completedStageSlugs: entryWithMostStageCompletions!.completedStageSlugs,
          currentCourseStage: entryWithMostStageCompletions!.currentCourseStage,
          language: entryWithMostStageCompletions!.language,
          user: entryWithMostStageCompletions!.user,
          lastAttemptAt: entryWithMostStageCompletions!.lastAttemptAt,
        }),
      );
    }

    return result.sort(fieldComparator('completedStagesCount', 'lastAttemptAt')).reverse();
  }

  pollLeaderboardTask = task({ keepLatest: true }, async (): Promise<void> => {
    if (!this.isLoadingEntries) {
      // Aside from initial loads, avoid thundering herd by waiting for a random amount of time (up to 1 second)
      const maxJitterMs = 1000;
      const delayMs = Math.floor(Math.random() * maxJitterMs);

      // In tests, running this with a low value like 10ms doesn't work, it ends up waiting for ~300ms.
      if (config.environment !== 'test') {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    this.entriesFromAPI = await new LeaderboardPoller(this.args.course, this.team || undefined).doPoll();
    this.isLoadingEntries = false;
    this.isReloadingEntries = false;
  });

  @action
  handleInviteButtonClick() {
    if (this.team) {
      this.analyticsEventTracker.track('clicked_invite_button', {
        source: 'team_course_leaderboard',
      });

      this.router.transitionTo('team', this.team.id);
    } else {
      this.analyticsEventTracker.track('clicked_invite_button', {
        source: 'course_leaderboard',
      });

      this.router.transitionTo('refer');
    }
  }

  @action
  async handleTeamChange(team: TeamModel | null) {
    this.team = team;
    this.leaderboardTeamStorage.setlastSelectedTeamId(team?.id ?? null);

    this.isReloadingEntries = true;
    this.pollLeaderboardTask.perform(); // start all over again
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
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    CourseLeaderboard: typeof CourseLeaderboard;
  }
}
