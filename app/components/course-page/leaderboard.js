import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import LeaderboardPoller from 'codecrafters-frontend/lib/leaderboard-poller';
import fade from 'ember-animated/transitions/fade';
import move from 'ember-animated/motions/move';
import { fadeIn, fadeOut } from 'ember-animated/motions/opacity';

export default class CoursePageLeaderboardComponent extends Component {
  transition = fade;
  @tracked isLoadingEntries = true;
  @tracked entriesFromAPI;
  @tracked polledCourse;
  @service store;
  @service visibility;

  get entries() {
    if (this.isLoadingEntries) {
      return [];
    }

    return this.entriesFromAPI.toArray().concat(this.entriesFromCurrentUser).sortBy('activeCourseStage.position', 'lastAttemptAt').reverse();
  }

  get entriesFromCurrentUser() {
    if (this.args.repositories.length === 0 && this.args.activeRepository.isNew) {
      return [];
    }

    return [
      this.store.createRecord('leaderboard-entry', {
        status: this.args.activeRepository.lastSubmissionIsEvaluating ? 'evaluating' : 'idle',
        activeCourseStage: this.args.activeRepository.activeStage,
        language: this.args.activeRepository.language,
        user: this.args.activeRepository.user,
        lastAttemptAt: this.args.activeRepository.lastSubmissionAt || new Date(),
      }),
    ];
  }

  @action
  async handleDidInsert() {
    this.entriesFromAPI = await this.store.query('leaderboard-entry', {
      course_id: this.args.course.id,
      include: 'language,active-course-stage,user',
    });

    this.isLoadingEntries = false;
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
    this.leaderboardPoller = new LeaderboardPoller({ store: this.store, visibilityService: this.visibility, intervalMilliseconds: 5000 });
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
