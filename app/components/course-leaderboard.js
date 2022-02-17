import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import LeaderboardPoller from 'codecrafters-frontend/lib/leaderboard-poller';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default class CourseLeaderboardComponent extends Component {
  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked isReloadingEntries = false;
  @tracked entriesFromAPI;
  @tracked polledCourse;
  @tracked team;
  @service currentUser;
  @service store;
  @service visibility;

  constructor() {
    super(...arguments);
    this.team = this.currentUserIsTeamMember ? this.currentUserTeams.firstObject : null;
  }

  get currentUserIsTeamMember() {
    return this.currentUser.isAuthenticated && !!this.currentUserTeams.firstObject;
  }

  get currentUserTeams() {
    if (this.currentUser.isAuthenticated) {
      return this.currentUser.record.teams;
    } else {
      return [];
    }
  }

  get entries() {
    if (this.isLoadingEntries) {
      return [];
    }

    let entries = [];

    if (this.entriesFromCurrentUser.length > 0) {
      entries = entries.concat(this.entriesFromAPI.toArray().filter((entry) => entry.user !== this.currentUser.record));
    } else {
      entries = entries.concat(this.entriesFromAPI.toArray());
    }

    return entries.concat(this.entriesFromCurrentUser);
  }

  get entriesFromCurrentUser() {
    if (this.args.repositories.length === 0 || this.args.activeRepository.isNew) {
      return [];
    }

    let allRepositories = this.args.repositories.toArray().concat([this.args.activeRepository]).uniq();

    return allRepositories.map((repository) => {
      return this.store.createRecord('leaderboard-entry', {
        status: repository.lastSubmissionIsEvaluating ? 'evaluating' : repository.allStagesAreComplete ? 'completed' : 'idle',
        currentCourseStage: repository.activeStage,
        language: repository.language,
        user: repository.user,
        lastAttemptAt: repository.lastSubmissionAt || repository.createdAt,
      });
    });
  }

  get mergedEntries() {
    let entriesGroupedByUser = {};

    this.entries.forEach((entry) => {
      entriesGroupedByUser[entry.user.id] ||= [];
      entriesGroupedByUser[entry.user.id].push(entry);
    });

    let result = [];

    for (const entriesForUser of Object.values(entriesGroupedByUser)) {
      let entryWithHighestCourseStage = entriesForUser.sortBy('currentCourseStage.position', 'lastSubmissionAt').lastObject;

      result.push(
        this.store.createRecord('leaderboard-entry', {
          status: entriesForUser.isAny('status', 'evaluating') ? 'evaluating' : entryWithHighestCourseStage.status,
          currentCourseStage: entryWithHighestCourseStage.currentCourseStage,
          language: entryWithHighestCourseStage.language,
          user: entryWithHighestCourseStage.user,
          lastAttemptAt: entryWithHighestCourseStage.lastAttemptAt,
        })
      );
    }

    return result.sortBy('currentCourseStage.position', 'lastAttemptAt').reverse();
  }

  @action
  async handleDidInsert() {
    if (this.team) {
      this.entriesFromAPI = await this.store.query('leaderboard-entry', {
        course_id: this.args.course.id,
        team_id: this.team.id,
        include: 'language,current-course-stage,user',
      });
    } else {
      this.entriesFromAPI = await this.store.query('leaderboard-entry', {
        course_id: this.args.course.id,
        include: 'language,current-course-stage,user',
      });
    }

    this.isLoadingEntries = false;
    this.isReloadingEntries = false;
    this.startLeaderboardPoller();
  }

  @action
  async handleWillDestroy() {
    this.stopLeaderboardPoller();
  }

  @action
  async handlePoll(entriesFromAPI) {
    this.entriesFromAPI = entriesFromAPI;
  }

  @action
  async handleTeamChange(team) {
    this.stopLeaderboardPoller();

    this.team = team;
    // this.entriesFromAPI = [];
    this.isReloadingEntries = true;

    this.handleDidInsert(); // start all over again
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

  startLeaderboardPoller() {
    this.stopLeaderboardPoller();

    this.leaderboardPoller = new LeaderboardPoller({
      store: this.store,
      visibilityService: this.visibility,
      intervalMilliseconds: 5000,
    });

    this.leaderboardPoller.team = this.team;
    this.leaderboardPoller.start(this.args.course, this.handlePoll);
    this.polledCourse = this.args.course;
  }

  stopLeaderboardPoller() {
    if (this.leaderboardPoller) {
      this.leaderboardPoller.stop();
    }

    this.polledCourse = null;
  }
}
