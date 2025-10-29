import Component from '@glimmer/component';
import CourseModel from 'codecrafters-frontend/models/course';
import CourseLeaderboardEntry from 'codecrafters-frontend/utils/course-leaderboard-entry';
import fade from 'ember-animated/transitions/fade';
import LeaderboardPoller from 'codecrafters-frontend/utils/leaderboard-poller';
import move from 'ember-animated/motions/move';
import { action, get } from '@ember/object';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
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
  transition = fade;

  leaderboardPoller: LeaderboardPoller | null = null;

  @tracked isLoadingEntries = true;
  @tracked isReloadingEntries = false;
  @tracked entriesFromAPI: CourseLeaderboardEntry[] = [];
  @tracked polledCourse?: CourseModel;
  @tracked team: TeamModel | null = null;

  @service declare actionCableConsumer: ActionCableConsumerService;
  @service declare analyticsEventTracker: AnalyticsEventTrackerService;
  @service declare authenticator: AuthenticatorService;
  @service declare leaderboardTeamStorage: LeaderboardTeamStorageService;
  @service declare router: RouterService;
  @service declare store: Store;
  @service declare visibility: VisibilityService;

  constructor(owner: unknown, args: Signature['Args']) {
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

    return allRepositories.uniq().map((repository) => {
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
      const entryWithMostStageCompletions = entriesForUser.sortBy('completedStagesCount', 'lastSubmissionAt').at(-1);

      result.push(
        new CourseLeaderboardEntry({
          status: entriesForUser.isAny('status', 'evaluating') ? 'evaluating' : entryWithMostStageCompletions!.status,
          completedStageSlugs: entryWithMostStageCompletions!.completedStageSlugs,
          currentCourseStage: entryWithMostStageCompletions!.currentCourseStage,
          language: entryWithMostStageCompletions!.language,
          user: entryWithMostStageCompletions!.user,
          lastAttemptAt: entryWithMostStageCompletions!.lastAttemptAt,
        }),
      );
    }

    return result.sortBy('completedStagesCount', 'lastAttemptAt').reverse();
  }

  @action
  async handleDidInsert() {
    if (this.team) {
      this.entriesFromAPI = (await this.store.query('course-leaderboard-entry', {
        course_id: this.args.course.id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      })) as unknown as CourseLeaderboardEntry[];
    } else {
      this.entriesFromAPI = (await this.store.query('course-leaderboard-entry', {
        course_id: this.args.course.id,
        include: 'language,current-course-stage,user',
      })) as unknown as CourseLeaderboardEntry[];
    }

    this.isLoadingEntries = false;
    this.isReloadingEntries = false;
    this.startLeaderboardPoller();
  }

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
  async handlePoll(entriesFromAPI: CourseLeaderboardEntry[]) {
    this.entriesFromAPI = entriesFromAPI;
  }

  @action
  async handleTeamChange(team: TeamModel | null) {
    this.stopLeaderboardPoller();

    this.team = team;
    this.leaderboardTeamStorage.setlastSelectedTeamId(team?.id ?? null);

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

    this.leaderboardPoller.team = this.team || undefined;
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
    CourseLeaderboard: typeof CourseLeaderboard;
  }
}
